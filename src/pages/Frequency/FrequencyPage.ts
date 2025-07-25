import { ref, computed, watch } from 'vue'
import { Notify, type QTableColumn } from 'quasar'
import { fetchFrequencies, saveFrequencies } from 'src/services/frequencyService'
import { useRouter } from 'vue-router'
import type { StudentFrequency } from 'src/types/StudentFrequency'
import type { FrequencyRequest, FrequencyResponse } from 'src/types/FrequencyResponse'
import { formatDateLabel, formatDate } from 'src/util/DateUtil'
import { useDiaryGradeStore } from 'src/stores/diaryStore'

const attendanceOptions = ['F', '.']
const lockRemoteClass = ref<Record<string, boolean>>({})
const lockLack = ref<Record<string, boolean>>({})
const lockPresence = ref<Record<string, boolean>>({})

export function useFrequencyPage() {
    const loading = ref(false)
    const students = ref<StudentFrequency[]>([])
    const columns = ref<QTableColumn<StudentFrequency>[]>([])
    const dateColumns = ref<string[]>([])
    const dateRange = ref<{ from: string; to: string } | null>(null)
    const columnPage = ref(1)
    const columnsPerPage = 10
    const dataLoaded = ref(false)
    const diaryStore = useDiaryGradeStore();
    const router = useRouter()

    const dateRangeText = computed(() => {
        if (!dateRange.value) return ''
        const format = (dateStr: string) => {
            const [year, month, day] = dateStr.split('-')
            return `${day}/${month}/${year}`
        }
        return `${format(dateRange.value.from)} - ${format(dateRange.value.to)}`
    })

    const filteredDateColumns = computed(() => {
        if (!Array.isArray(dateColumns.value)) return []
        return dateColumns.value.filter((d) => {
            const datePart = d.split(' - ')[1]
            if (!datePart) return false
            if (!dateRange.value) return true

            const [day, month] = datePart.split('/')
            const refDate = `${new Date().getFullYear()}-${month}-${day}`
            return (!dateRange.value.from || refDate >= dateRange.value.from) &&
                (!dateRange.value.to || refDate <= dateRange.value.to)
        })
    })

    const paginatedDateColumns = computed(() => {
        const start = (columnPage.value - 1) * columnsPerPage
        return filteredDateColumns.value.slice(start, start + columnsPerPage)
    })

    const toggleActions = [
        {
            label: 'Aula não presencial',
            handler: onToggleRemoteClass,
            lockRef: lockRemoteClass,
            color: 'primary'
        },
        {
            label: 'Falta',
            handler: onToggleLack,
            lockRef: lockLack,
            color: 'negative'
        },
        {
            label: 'Presença',
            handler: onTogglePresence,
            lockRef: lockPresence,
            color: 'positive'
        }
    ]

    function clearOtherToggles(currentRef: typeof lockRemoteClass, col: string) {
        [lockRemoteClass, lockLack, lockPresence].forEach((ref) => {
            if (ref !== currentRef) ref.value[col] = false
        })
    }

    function onToggleRemoteClass(col: string, value: boolean) {
        lockRemoteClass.value[col] = value
        if (value) clearOtherToggles(lockRemoteClass, col)
        applyToggleValue(col, value ? '-' : '')
    }

    function onToggleLack(col: string, value: boolean) {
        lockLack.value[col] = value
        if (value) clearOtherToggles(lockLack, col)
        applyToggleValue(col, value ? 'F' : '')
    }

    function onTogglePresence(col: string, value: boolean) {
        lockPresence.value[col] = value
        if (value) clearOtherToggles(lockPresence, col)
        applyToggleValue(col, value ? '.' : '')
    }

    function applyToggleValue(col: string, value: string) {
        for (const student of students.value) {
            if (!student.hasOccurrence && student.editableFrequencies[col]?.editable && !student.editableFrequencies[col]?.observation) {
                const existing = student.frequencies[col]
                if (existing) {
                    student.frequencies[col] = {
                        id: existing.id,
                        classTime: existing.classTime,
                        date: existing.date,
                        value: value
                    }
                }
                student.editableFrequencies[col].editable = true
            }
        }
    }

    function onManualFrequencyChange(col: string) {
        const values = students.value
            .filter(s => !s.hasOccurrence)
            .map(s => s.frequencies[col]?.value ?? '')

        const unique = new Set(values)

        lockRemoteClass.value[col] = false
        lockLack.value[col] = false
        lockPresence.value[col] = false

        if (unique.size === 1) {
            const value = [...unique][0]
            if (value === '-') lockRemoteClass.value[col] = true
            else if (value === 'F') lockLack.value[col] = true
            else if (value === '.') lockPresence.value[col] = true
        }
    }

    function syncTogglesWithFrequencies() {
        lockRemoteClass.value = {}
        lockLack.value = {}
        lockPresence.value = {}
        for (const col of dateColumns.value) {
            onManualFrequencyChange(col)
        }
    }

    async function onClearDateFilter() {
        dateRange.value = null
        columnPage.value = 1
        await loadStudents()
    }

    async function loadStudents() {
        loading.value = true
        dataLoaded.value = false
        try {
            const response: FrequencyResponse = await fetchFrequencies()
            students.value = response.studentsFrequency.sort((a, b) => a.callNumber - b.callNumber)
            dateColumns.value = response.dateColumns
            dataLoaded.value = true
            syncTogglesWithFrequencies()
        } catch (err) {
            console.error('Erro ao carregar dados da frequência:', err)
        } finally {
            loading.value = false
        }
    }

    const showObservationModal = ref(false)
    const selectedStudentObservations = ref<{ start: string; end: string; text: string }[]>([])

    function openObservationModal(studentId: number) {
        const student = students.value.find(s => s.id === studentId)
        if (!student) return
        selectedStudentObservations.value = []
        showObservationModal.value = true
    }

    watch([paginatedDateColumns], () => {
        const dynamicColumns: QTableColumn<StudentFrequency>[] = paginatedDateColumns.value.map((dateKey) => ({
            name: dateKey,
            label: formatDateLabel(dateKey),
            field: (row) => row.frequencies[dateKey],
            align: 'center'
        }))
        columns.value = [
            { name: 'callNumber', label: 'N.', field: 'callNumber', align: 'center', sortable: true },
            { name: 'name', label: 'Nome do Aluno', field: 'name', align: 'left', sortable: true },
            ...dynamicColumns,
            {
                name: 'observation',
                label: 'Observação',
                field: 'id',
                align: 'center',
                format: (val) => (val ? 'Sim' : 'Não')
            }
        ]
    }, { immediate: true })

    async function onSaveFrequencies() {
        try {
            loading.value = true

            const response = await saveFrequencies(mountRequest())

            if (diaryStore.selectedDiaryGrade) {
                diaryStore.selectedDiaryGrade.id = response.data;
            }

            notify('positive', 'Frequências salvas com sucesso.')

            await loadStudents();
        } catch (error) {
            console.error('Erro ao salvar frequências:', error)
            notify('negative', 'Erro ao salvar frequências.')
        } finally {
            loading.value = false
        }
    }

    async function onSendFrequencies() {
        const allFilled = students.value.every(s =>
            s.hasOccurrence || Object.values(s.frequencies).every(f => f.value !== '')
        )
        if (!allFilled) {
            notify('warning', 'Preencha todas as frequências antes de enviar.')
            return
        }

        if (diaryStore.selectedDiaryGrade?.diaryStatusId) {
            diaryStore.selectedDiaryGrade.diaryStatusId = 2;
        }

        try {
            loading.value = true
            await saveFrequencies(mountRequest())
            notify('positive', 'Frequências enviadas com sucesso!')
            await router.push('/selection-frequency')
        } catch (error) {
            console.error('Erro ao enviar frequências:', error)
            notify('negative', 'Erro ao enviar frequências')
        } finally {
            loading.value = false
        }
    }

    function mountRequest(): FrequencyRequest {
        return {
            studentsFrequency: students.value,
            diaryGrade: diaryStore.selectedDiaryGrade!
        }
    }

    function notify(type: 'positive' | 'negative' | 'warning', message: string) {
        Notify.create({ type, message, position: 'top-right' })
    }

    return {
        loading,
        students,
        columns,
        loadStudents,
        attendanceOptions,
        dateRange,
        dateRangeText,
        filteredDateColumns,
        paginatedDateColumns,
        columnPage,
        columnsPerPage,
        onClearDateFilter,
        toggleActions,
        onManualFrequencyChange,
        openObservationModal,
        formatDate,
        showObservationModal,
        selectedStudentObservations,
        dataLoaded,
        onSaveFrequencies,
        onSendFrequencies
    }
}