import { ref, computed, watch } from 'vue'
import type { QTableColumn } from 'quasar'

export type Student = {
    id: number
    name: string
    registration: string
    status: string
    hasObservation: boolean
    frequencies: Record<string, string>
    editableFrequencies: Record<string, boolean>
}

const attendanceOptions = ['F', '.']

const rawDates = Array.from({ length: 20 }, (_, i) => {
    const day = 18 + Math.floor(i / 4)
    const month = 6
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`
})

const uniqueSortedDates = Array.from(new Set(rawDates)).sort((a, b) => {
    const [dayA, monthA] = a.split('/')
    const [dayB, monthB] = b.split('/')
    const dA = new Date(2025, parseInt(monthA!) - 1, parseInt(dayA!))
    const dB = new Date(2025, parseInt(monthB!) - 1, parseInt(dayB!))
    return dA.getTime() - dB.getTime()
})

const dateColumns = uniqueSortedDates.flatMap((date) =>
    [1, 2, 3, 4].map((tempo) => `${tempo} - ${date}`)
)

const lockRemoteClass = ref<Record<string, boolean>>({})
const lockLack = ref<Record<string, boolean>>({})
const lockPresence = ref<Record<string, boolean>>({})

export function useFrequencyPage() {
    const loading = ref(false)
    const students = ref<Student[]>([])
    const columns = ref<QTableColumn<Student>[]>([])

    const dateRange = ref<{ from: string; to: string } | null>(null)

    const dateRangeText = computed(() => {
        if (!dateRange.value) return ''
        const format = (dateStr: string) => {
            const [year, month, day] = dateStr.split('-')
            return `${day}/${month}/${year}`
        }
        return `${format(dateRange.value.from)} - ${format(dateRange.value.to)}`
    })

    const filteredDateColumns = computed(() =>
        dateColumns.filter((d) => {
            const datePart = d.split(' - ')[1]
            if (!datePart) return false
            if (!dateRange.value) return true
            const [day, month] = datePart.split('/')
            const refDate = `${new Date().getFullYear()}-${month}-${day}`
            if (dateRange.value.from && refDate < dateRange.value.from) return false
            if (dateRange.value.to && refDate > dateRange.value.to) return false
            return true
        })
    )

    const columnPage = ref(1)
    const columnsPerPage = 10

    const paginatedDateColumns = computed(() => {
        const start = (columnPage.value - 1) * columnsPerPage
        const end = start + columnsPerPage
        return filteredDateColumns.value.slice(start, end)
    })

    function clearOtherToggles(currentRef: typeof lockRemoteClass, col: string) {
        [lockRemoteClass, lockLack, lockPresence].forEach((ref) => {
            if (ref !== currentRef) ref.value[col] = false
        })
    }

    function onToggleRemoteClass(col: string, value: boolean) {
        lockRemoteClass.value[col] = value
        if (value) clearOtherToggles(lockRemoteClass, col)
        for (const student of students.value) {
            student.frequencies[col] = value ? '-' : ''
            student.editableFrequencies[col] = !value
        }
    }

    function onToggleLack(col: string, value: boolean) {
        lockLack.value[col] = value
        if (value) clearOtherToggles(lockLack, col)
        for (const student of students.value) {
            student.frequencies[col] = value ? 'F' : ''
            student.editableFrequencies[col] = true
        }
    }

    function onTogglePresence(col: string, value: boolean) {
        lockPresence.value[col] = value
        if (value) clearOtherToggles(lockPresence, col)
        for (const student of students.value) {
            student.frequencies[col] = value ? '.' : ''
            student.editableFrequencies[col] = true
        }
    }

    function onManualFrequencyChange(col: string) {
        const values = new Set(students.value.map((s) => s.frequencies[col]))
        const allEqual = values.size === 1
        if (!allEqual) {
            lockRemoteClass.value[col] = false
            lockLack.value[col] = false
            lockPresence.value[col] = false
        }
    }

    function onClearDateFilter() {
        dateRange.value = null
        columnPage.value = 1
        loadStudents()
    }

    function loadStudents() {
        loading.value = true
        try {
            students.value = [
                {
                    id: 1,
                    name: 'João da Silva (TRANSFERIDO DIA 08/07/2025)',
                    registration: '2023001',
                    status: 'Ativo',
                    hasObservation: true,
                    frequencies: Object.fromEntries(
                        dateColumns.map((d, i) => [d, i % 5 === 0 ? '-' : i % 4 === 0 ? 'F' : '.'])
                    ),
                    editableFrequencies: Object.fromEntries(
                        dateColumns.map((d, i) => {
                            const value = i % 5 === 0 ? '-' : i % 4 === 0 ? 'F' : '.'
                            if (value === '-') return [d, false]
                            if (['20/06', '21/06', '22/06'].includes(d.split(' - ')[1]!)) return [d, false]
                            return [d, true]
                        })
                    )
                },
                {
                    id: 2,
                    name: 'Maria Oliveira',
                    registration: '2023002',
                    status: 'Ativo',
                    hasObservation: false,
                    frequencies: Object.fromEntries(
                        dateColumns.map((d, i) => [d, i % 3 === 0 ? '.' : i % 3 === 1 ? '-' : 'F'])
                    ),
                    editableFrequencies: Object.fromEntries(
                        dateColumns.map((d, i) => {
                            const value = i % 3 === 0 ? '.' : i % 3 === 1 ? '-' : 'F'
                            return [d, value === '-' ? false : true]
                        })
                    )
                }
            ]
        } catch (err) {
            console.error('Erro ao carregar alunos:', err)
        } finally {
            loading.value = false
        }
    }

    const toggleActions = [
        {
            label: 'Aula não presencial',
            handler: onToggleRemoteClass,
            lockRef: lockRemoteClass,
            icon: 'lock',
            color: 'primary'
        },
        {
            label: 'Falta',
            handler: onToggleLack,
            lockRef: lockLack,
            icon: 'close',
            color: 'negative'
        },
        {
            label: 'Presença',
            handler: onTogglePresence,
            lockRef: lockPresence,
            icon: 'check',
            color: 'positive'
        }
    ]

    watch([paginatedDateColumns], () => {
        const dynamicColumns: QTableColumn<Student>[] = paginatedDateColumns.value.map((dateKey) => ({
            name: dateKey,
            label: dateKey,
            field: (row) => row.frequencies[dateKey],
            align: 'center'
        }))

        columns.value = [
            { name: 'name', label: 'Nome do Aluno', field: 'name', align: 'left', sortable: true },
            ...dynamicColumns,
            {
                name: 'observation',
                label: 'Observação',
                field: 'hasObservation',
                align: 'center',
                format: (val) => (val ? 'Sim' : 'Não')
            }
        ]
    }, { immediate: true })

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
        onManualFrequencyChange
    }
}