import { ref, computed, watch } from 'vue'
import { Notify, type QTableColumn } from 'quasar'
import type { StudentFrequency, StudentFrequencySaveDTO } from 'src/types/StudentFrequency'
import type { FrequencyResponse, FrequencySavePayload } from 'src/types/FrequencyResponse'
import { fetchFrequencies, saveFrequencies } from 'src/services/frequency/frequencyService'
import { useDiaryGradeStore } from 'src/stores/diaryStore'
import { useRouter } from 'vue-router'

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
      if (dateRange.value.from && refDate < dateRange.value.from) return false
      if (dateRange.value.to && refDate > dateRange.value.to) return false
      return true
    })
  })

  const columnPage = ref(1)
  const columnsPerPage = 10

  const paginatedDateColumns = computed(() => {
    const start = (columnPage.value - 1) * columnsPerPage
    const end = start + columnsPerPage
    return filteredDateColumns.value.slice(start, end)
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

  const dataLoaded = ref(false)
  const diaryStore = useDiaryGradeStore();
  const router = useRouter()

  function clearOtherToggles(currentRef: typeof lockRemoteClass, col: string) {
    [lockRemoteClass, lockLack, lockPresence].forEach((ref) => {
      if (ref !== currentRef) ref.value[col] = false
    })
  }

  function onToggleRemoteClass(col: string, value: boolean) {
    lockRemoteClass.value[col] = value
    if (value) clearOtherToggles(lockRemoteClass, col)

    for (const student of students.value) {
      const isTransferred = student.hasOccurrence;

      if (!isTransferred && student.editableFrequencies[col]?.editable && !student.editableFrequencies[col]?.observation) {
        student.frequencies[col] = {
          ...student.frequencies[col],
          value: value ? '-' : ''
        }
        student.editableFrequencies[col].editable = true
      }
    }
  }

  function onToggleLack(col: string, value: boolean) {
    lockLack.value[col] = value
    if (value) clearOtherToggles(lockLack, col)
    for (const student of students.value) {
      if (student.editableFrequencies[col]?.editable && !student.editableFrequencies[col]?.observation) {
        student.frequencies[col] = {
          ...student.frequencies[col],
          value: value ? 'F' : ''
        }
        student.editableFrequencies[col].editable = true
      }
    }
  }

  function onTogglePresence(col: string, value: boolean) {
    lockPresence.value[col] = value
    if (value) clearOtherToggles(lockPresence, col)
    for (const student of students.value) {
      if (student.editableFrequencies[col]?.editable && !student.editableFrequencies[col]?.observation) {
        student.frequencies[col] = {
          ...student.frequencies[col],
          value: value ? '.' : ''
        }
        student.editableFrequencies[col].editable = true
      }
    }
  }

  function onManualFrequencyChange(col: string) {
    const values = students.value.map((s) => s.frequencies[col]?.value ?? '')
    const unique = new Set(values)

    if (unique.size !== 1) {
      lockRemoteClass.value[col] = false
      lockLack.value[col] = false
      lockPresence.value[col] = false
      return
    }

    const value = values[0]
    lockRemoteClass.value[col] = false
    lockLack.value[col] = false
    lockPresence.value[col] = false

    if (value === '-') lockRemoteClass.value[col] = true
    else if (value === 'F') lockLack.value[col] = true
    else if (value === '.') lockPresence.value[col] = true
  }

  function syncTogglesWithFrequencies() {
    lockRemoteClass.value = {}
    lockLack.value = {}
    lockPresence.value = {}

    for (const col of filteredDateColumns.value) {
      const values = students.value.map((s) => s.frequencies[col]?.value ?? '')
      const unique = new Set(values)

      if (unique.size === 1) {
        const value = [...unique][0]
        if (value === '-') lockRemoteClass.value[col] = true
        if (value === 'F') lockLack.value[col] = true
        if (value === '.') lockPresence.value[col] = true
      }
    }
  }

  async function onClearDateFilter() {
    dateRange.value = null
    columnPage.value = 1
    await loadStudents();
  }

  async function loadStudents() {
    loading.value = true
    dataLoaded.value = false

    try {
      const response: FrequencyResponse = await fetchFrequencies()

      students.value = Array.isArray(response.students) ? response.students.sort((a, b) => a.callNumber - b.callNumber) : []

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

    selectedStudentObservations.value = [
      {
        start: '2025-06-20',
        end: '2025-06-22',
        text: 'Atestado médico por gripe.'
      },
      {
        start: '2025-06-28',
        end: '2025-06-29',
        text: 'Consulta ortopédica.'
      }
    ]

    showObservationModal.value = true
  }

  function formatDate(date: string): string {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR')
  }

  watch([paginatedDateColumns], () => {
    const dynamicColumns: QTableColumn<StudentFrequency>[] = paginatedDateColumns.value.map((dateKey) => ({
      name: dateKey,
      label: dateKey,
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
        field: 'hasObservation',
        align: 'center',
        format: (val) => (val ? 'Sim' : 'Não')
      }
    ]
  }, { immediate: true })

  async function onSaveFrequencies() {
    const { start, end } = getStartEndDates()

    try {
      loading.value = true

      const payload = buildFrequencyPayload(students.value, start, end, true)
      const response = await saveFrequencies(payload)

      diaryStore.selectedDiaryGrade = response.data.diaryGrade

      updateFrequencyIdsFromResponse(response.data.frequencies)

      notify('positive', response.msg)
    } catch (error) {
      console.error('Erro ao salvar frequências:', error)
      notify('negative', 'Erro ao salvar frequências')
    } finally {
      loading.value = false
    }
  }

  async function onSendFrequencies() {
    const { start, end } = getStartEndDates()

    if (diaryStore.selectedDiaryGrade) {
      diaryStore.selectedDiaryGrade.diaryStatusId = 2
    }

    const payload = buildFrequencyPayload(students.value, start, end, false)

    const allFilled = payload.frequencies.every(student =>
      student.hasOccurrence || student.frequencies.every(freq => freq.value !== '')
    )

    if (!allFilled) {
      notify('warning', 'Preencha todas as frequências antes de enviar.')
      return
    }

    try {
      loading.value = true

      await saveFrequencies(payload)

      notify('positive', 'Frequências enviadas com sucesso!')
      await router.push('/selection-frequency')
    } catch (error) {
      console.error('Erro ao enviar frequências:', error)
      notify('negative', 'Erro ao enviar frequências')
    } finally {
      loading.value = false
    }
  }

  function getStartEndDates() {
    const bimester = diaryStore.selectedDiaryGrade?.bimesterPeriod
    return {
      start: new Date(bimester?.startDate ?? ''),
      end: new Date(bimester?.endDate ?? '')
    }
  }

  function updateFrequencyIdsFromResponse(updatedList: StudentFrequencySaveDTO[]) {
    updatedList.forEach(updatedStudent => {
      const student = students.value.find(s => s.id === updatedStudent.id)
      if (!student) return

      updatedStudent.frequencies.forEach(({ id, classTime, date }) => {
        const d = new Date(date)
        const day = String(d.getUTCDate()).padStart(2, '0')
        const month = String(d.getUTCMonth() + 1).padStart(2, '0')
        const key = `${classTime} - ${day}/${month}`

        if (student.frequencies[key]) {
          student.frequencies[key].id = id!
        }
      })
    })
  }

  function notify(type: 'positive' | 'negative' | 'warning', message: string) {
    Notify.create({ type, message, position: 'top-right' })
  }

  function buildFrequencyPayload(
    students: StudentFrequency[],
    start: Date,
    end: Date,
    filterEmpty: boolean
  ): FrequencySavePayload {
    return {
      frequencies: students.map(student => ({
        id: student.id,
        name: student.name.replace(/\s*\(.*?\)/g, '').trim(),
        callNumber: student.callNumber,
        hasOccurrence: student.hasOccurrence,
        frequencies: Object.entries(student.frequencies)
          .filter(([, { value }]) => !filterEmpty || value !== '')
          .map(([columnKey, { value, id }]) => {
            const [classTimeRaw, dateStrRaw] = columnKey.split(' - ')
            const classTime = classTimeRaw ?? ''
            const dateStr = dateStrRaw ?? ''

            const date = formatDateToISO(dateStr, start, end)

            return {
              id,
              classTime,
              date,
              value
            }
          }).sort((a, b) => a.date.localeCompare(b.date))
      })),
      diaryGrade: diaryStore.selectedDiaryGrade!
    }
  }

  function formatDateToISO(dateStr: string | undefined, start: Date, end: Date): string {
    const [day, month] = (dateStr ?? '').split('/')
    if (!day || !month) return ''

    const dStart = new Date(`${start.getFullYear()}-${month}-${day}`)
    const dEnd = new Date(`${end.getFullYear()}-${month}-${day}`)

    if (dStart >= start && dStart <= end) {
      return dStart.toISOString().split('T')[0]!
    } else if (dEnd >= start && dEnd <= end) {
      return dEnd.toISOString().split('T')[0]!
    }

    return `${start.getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
