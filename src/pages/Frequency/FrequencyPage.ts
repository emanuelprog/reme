import { ref, computed, watch } from 'vue';
import type { QTableColumn } from 'quasar';
import { fetchSchools, fetchTeachingType, fetchYears } from 'src/services/filters/filtersService';
import type { TeachingType, School, Year } from 'src/types/FilterOption';
import { useFilterStore } from 'src/stores/filterStore';

interface FilterModel {
  teachingType: TeachingType | null;
  school: School | null;
  year: number | null;
  // shift: string | null;
  // group: number | null;
  // discipline: string | null;
  // class: string | null;
  // bimester: number | null;
}

const initialFilters: FilterModel = {
  teachingType: null,
  school: null,
  year: null,
  // shift: null,
  // group: null,
  // discipline: null,
  // class: null,
  // bimester: null
};

const selectFields = ref({
  teachingType: {
    label: 'Etapa da Ed. Básica / Modalidade',
    optionLabel: 'description',
    optionValue: 'id',
    options: [] as TeachingType[]
  },
  school: {
    label: 'Unidade Escolar',
    optionLabel: 'sectorName',
    optionValue: 'sector',
    options: [] as School[]
  },
  year: { 
    label: 'Ano Referência',
    optionLabel: 'value',
    optionValue: 'value',
    options: [] as Year[] 
  },
  // shift: {
  //   label: 'Turno',
  //   optionLabel: 'description',
  //   optionValue: 'id',
  //   options: [] as Shift[]
  // },
  // group: { label: 'Grupo / Ano Escolar', options: [] as SelectOption[] },
  // discipline: { label: 'Professor / Componente Curricular', options: [] as SelectOption[] },
  // class: { label: 'Turma', options: [] as SelectOption[] },
  // bimester: { label: 'Bimestre', options: [] as SelectOption[] }
});

const rows = ref([
  {
    id: 1,
    teachingType: 'Ensino Fundamental',
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
    teachingType: 'Ensino Médio',
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
  { name: 'teachingType', label: 'Etapa', field: 'teachingType', align: 'left', sortable: true },
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

const filterStore = useFilterStore();

async function loadSelectOptions() {
  const teachingTypeData = await fetchTeachingType();
  selectFields.value.teachingType.options = Array.isArray(teachingTypeData.data) ? teachingTypeData.data : [];

  const schoolsData = await fetchSchools();
  selectFields.value.school.options = Array.isArray(schoolsData.data) ? schoolsData.data : [];
}

watch([() => filters.value.teachingType, () => filters.value.school], async ([teachingType, school]) => {
  filterStore.setSelections(teachingType, school, null);
  
  const yearData = await fetchYears();
  selectFields.value.year.options = Array.isArray(yearData) ? yearData : [];
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
  const filled = Object.values(filters.value).every(val => val !== null && val !== null);
  if (filled) alert('Diário criado com sucesso!');
}

export function useFrequencyPage() {
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
    clearFilters,
    loadSelectOptions
  };
}