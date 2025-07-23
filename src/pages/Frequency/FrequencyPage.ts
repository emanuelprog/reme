import { ref, computed, watch } from 'vue'
import type { QTableColumn } from 'quasar'
import type { StudentFrequency } from 'src/types/StudentFrequency'
import type { FrequencyResponse } from 'src/types/FrequencyResponse'
import { fetchFrequencies } from 'src/services/frequency/frequencyService'

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

  const dataLoaded = ref(false)

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
    const values = students.value.map((s) => s.frequencies[col])
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
      students.value = Array.isArray(response.students) ? response.students : []
      dateColumns.value = response.dateColumns
      dataLoaded.value = true
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
    onManualFrequencyChange,
    openObservationModal,
    formatDate,
    showObservationModal,
    selectedStudentObservations,
    dataLoaded
  }
}
