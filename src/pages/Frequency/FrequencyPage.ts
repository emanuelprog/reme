import { ref, computed, watch } from 'vue';
import type { QTableColumn } from 'quasar';
import { fetchDisciplines, fetchGrades, fetchGroups, fetchSchools, fetchShifts, fetchTeachingType, fetchYears } from 'src/services/filters/filtersService';
import type { TeachingType, School, Year, Shift, Group, Discipline, Grade, Bimester } from 'src/types/FilterOption';
import { useFilterStore } from 'src/stores/filterStore';

interface FilterModel {
  teachingType: TeachingType | null;
  school: School | null;
  year: Year | null;
  shift: Shift | null;
  group: Group | null;
  discipline: Discipline | null;
  grade: Grade | null;
  bimester: Bimester | null;
}

const initialFilters: FilterModel = {
  teachingType: null,
  school: null,
  year: null,
  shift: null,
  group: null,
  discipline: null,
  grade: null,
  bimester: null
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
  shift: {
    label: 'Turno',
    optionLabel: 'description',
    optionValue: 'id',
    options: [] as Shift[]
  },
  group: { 
    label: 'Grupo / Ano Escolar',
    optionLabel: 'description',
    optionValue: 'id',
    options: [] as Group[] 
  },
  discipline: { 
    label: 'Professor / Componente Curricular',
    optionLabel: 'description',
    optionValue: 'id',
    options: [] as Discipline[] 
  },
  grade: { 
    label: 'Turma',
    optionLabel: 'description',
    optionValue: 'id',
    options: [] as Grade[] 
  },
  bimester: { 
    label: 'Bimestre', 
    optionLabel: 'value',
    optionValue: 'value',
    options: [] as Bimester[] 
  }
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
    grade: 'Turma A',
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
    grade: 'Turma B',
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
  { name: 'grade', label: 'Turma', field: 'grade', align: 'left', sortable: true },
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
}

watch(
  () => filters.value.teachingType,
  (teachingType) => {
    filters.value.school = null;
    filters.value.year = null;

    filterStore.setSelections(teachingType, null, null, null, null, null, null, null);

    if (teachingType?.id) {
      void fetchSchools().then((res) => {
        selectFields.value.school.options = Array.isArray(res.data) ? res.data : [];
      });
    } else {
      selectFields.value.school.options = [];
      selectFields.value.year.options = [];
      selectFields.value.shift.options = [];
      selectFields.value.group.options = [];
      selectFields.value.discipline.options = [];
      selectFields.value.grade.options = [];
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.school,
  (school) => {
    filters.value.year = null;

    filterStore.setSelections(filters.value.teachingType, school, null, null, null, null, null, null);

    if (filters.value.teachingType && school?.sector) {
      void fetchYears().then((res) => {
        selectFields.value.year.options = Array.isArray(res.data) ? res.data : [];
      });
    } else {
      selectFields.value.year.options = [];
      selectFields.value.shift.options = [];
      selectFields.value.group.options = [];
      selectFields.value.discipline.options = [];
      selectFields.value.grade.options = [];
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.year,
  (year) => {
    filters.value.shift = null;

    filterStore.setSelections(filters.value.teachingType, filters.value.school, year, null, null, null, null, null);

    if (filters.value.teachingType && filters.value.school && year) {
      void fetchShifts().then((res) => {
        selectFields.value.shift.options = Array.isArray(res.data) ? res.data : [];
      });
    } else {
      selectFields.value.shift.options = [];
      selectFields.value.group.options = [];
      selectFields.value.discipline.options = [];
      selectFields.value.grade.options = [];
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.shift,
  (shift) => {
    filters.value.group = null;

    filterStore.setSelections(filters.value.teachingType, filters.value.school, filters.value.year, shift, null, null, null, null);

    if (filters.value.teachingType && filters.value.school && filters.value.year && shift?.id) {
      void fetchGroups().then((res) => {
        selectFields.value.group.options = Array.isArray(res.data) ? res.data : [];
      });
    } else {
      selectFields.value.group.options = [];
      selectFields.value.discipline.options = [];
      selectFields.value.grade.options = [];
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.group,
  (group) => {
    filters.value.discipline = null;

    filterStore.setSelections(filters.value.teachingType, filters.value.school, filters.value.year, filters.value.shift, group, null, null, null);

    if (filters.value.teachingType && filters.value.school && filters.value.year && filters.value.shift && group?.id) {
      void fetchDisciplines().then((res) => {
        selectFields.value.discipline.options = Array.isArray(res.data) ? res.data : [];
      });
    } else {
      selectFields.value.discipline.options = [];
      selectFields.value.grade.options = [];
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.discipline,
  (discipline) => {
    filters.value.grade = null;

    filterStore.setSelections(filters.value.teachingType, filters.value.school, filters.value.year, filters.value.shift, filters.value.group, discipline, null, null);

    if (filters.value.teachingType && filters.value.school && filters.value.year && filters.value.shift && filters.value.group && discipline?.id) {
      void fetchGrades().then((res) => {
        selectFields.value.grade.options = Array.isArray(res.data) ? res.data : [];
      });
    } else {
      selectFields.value.grade.options = [];
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.grade,
  (grade) => {
    filters.value.bimester = null;

    filterStore.setSelections(filters.value.teachingType, filters.value.school, filters.value.year, filters.value.shift, filters.value.group, filters.value.discipline, grade, null);

    if (filters.value.teachingType && filters.value.school && filters.value.year && filters.value.shift && filters.value.group && filters.value.discipline && grade?.id) {
        selectFields.value.bimester.options = [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 }
        ];
    } else {
      selectFields.value.bimester.options = [];
    }
  }
);

watch(
  () => filters.value.bimester,
  (bimester) => {
    filterStore.setSelections(filters.value.teachingType, filters.value.school, filters.value.year, filters.value.shift, filters.value.group, filters.value.discipline, filters.value.grade, bimester);
  }
);

function clearFilters() {
  filters.value = { ...initialFilters };
  validate.value = false;
  showTable.value = false;

  selectFields.value.school.options = [];
  selectFields.value.year.options = [];
  filterStore.setSelections(null, null, null, null, null, null, null, null);
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