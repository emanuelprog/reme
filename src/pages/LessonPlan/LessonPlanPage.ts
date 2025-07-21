import { ref, computed } from 'vue';
import type { QTableColumn } from 'quasar';

interface FilterModel {
  stage: string | null;
  school: string | null;
  year: number | null;
  shift: string | null;
  group: number | null;
  discipline: string | null;
  class: string | null;
  bimester: number | null;
}

const initialFilters: FilterModel = {
  stage: null,
  school: null,
  year: null,
  shift: null,
  group: null,
  discipline: null,
  class: null,
  bimester: null
};

const selectFields = {
  stage: { label: 'Etapa da Ed. Básica / Modalidade', options: [
    { label: 'Ensino Fundamental', value: 'fundamental' },
    { label: 'Ensino Médio', value: 'medio' },
    { label: 'EJA', value: 'eja' }
  ]},
  school: { label: 'Unidade Escolar', options: [
    { label: 'Escola Municipal A', value: 'a' },
    { label: 'Escola Municipal B', value: 'b' },
    { label: 'Escola Estadual C', value: 'c' }
  ]},
  year: { label: 'Ano Referência', options: [
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 }
  ]},
  shift: { label: 'Turno', options: [
    { label: 'Matutino', value: 'manha' },
    { label: 'Vespertino', value: 'tarde' },
    { label: 'Noturno', value: 'noite' }
  ]},
  group: { label: 'Grupo / Ano Escolar', options: [
    { label: '1º Ano', value: 1 },
    { label: '2º Ano', value: 2 },
    { label: '3º Ano', value: 3 }
  ]},
  discipline: { label: 'Professor / Componente Curricular', options: [
    { label: 'Matemática', value: 'Matemática' },
    { label: 'Português', value: 'Português' },
    { label: 'Ciências', value: 'Ciências' }
  ]},
  class: { label: 'Turma', options: [
    { label: 'Turma A', value: 'a' },
    { label: 'Turma B', value: 'b' },
    { label: 'Turma C', value: 'c' }
  ]},
  bimester: { label: 'Bimestre', options: [
    { label: '1º Bimestre', value: 1 },
    { label: '2º Bimestre', value: 2 },
    { label: '3º Bimestre', value: 3 },
    { label: '4º Bimestre', value: 4 }
  ]}
};

const rows = ref([
  {
    id: 1,
    stage: 'Ensino Fundamental',
    school: 'Escola Municipal A',
    year: 2024,
    shift: 'Matutino',
    group: 1,
    discipline: 'Português',
    class: 'Turma A',
    bimester: '1º Bimestre'
  },
  {
    id: 2,
    stage: 'Ensino Médio',
    school: 'Escola Estadual C',
    year: 2025,
    shift: 'Noturno',
    group: 3,
    discipline: 'Matemática',
    class: 'Turma B',
    bimester: '2º Bimestre'
  }
]);

const columns: QTableColumn[] = [
  { name: 'stage', label: 'Etapa', field: 'stage', align: 'left', sortable: true },
  { name: 'school', label: 'Escola', field: 'school', align: 'left', sortable: true },
  { name: 'year', label: 'Ano', field: 'year', align: 'left', sortable: true },
  { name: 'shift', label: 'Turno', field: 'shift', align: 'left', sortable: true },
  { name: 'group', label: 'Grupo', field: 'group', align: 'left', sortable: true },
  { name: 'discipline', label: 'Disciplina', field: 'discipline', align: 'left', sortable: true },
  { name: 'class', label: 'Turma', field: 'class', align: 'left', sortable: true },
  { name: 'bimester', label: 'Bimestre', field: 'bimester', align: 'left', sortable: true }
];

const filters = ref<FilterModel>({ ...initialFilters });
const validate = ref(false);
const showTable = ref(false);
const loading = ref(false);

const paginationCards = ref({ page: 1, rowsPerPage: 2 });

const paginatedCards = computed(() => {
  const start = (paginationCards.value.page - 1) * paginationCards.value.rowsPerPage;
  const end = start + paginationCards.value.rowsPerPage;
  return rows.value.slice(start, end);
});

function clearFilters() {
  filters.value = { ...initialFilters };
  validate.value = false;
  showTable.value = false;
}

function onSearch() {
  loading.value = true;
  validate.value = false;
  showTable.value = false;
  setTimeout(() => {
    loading.value = false;
    showTable.value = true;
  }, 1000);
}

function onCreate() {
  validate.value = true;
  const filled = Object.values(filters.value).every(val => val !== null && val !== '');
  if (filled) alert('Diário criado com sucesso!');
}

export function useLessonPlanPage() {
  return {
    filters,
    selectFields,
    validate,
    showTable,
    loading,
    rows,
    columns,
    paginationCards,
    paginatedCards,
    onSearch,
    onCreate,
    clearFilters
  };
}