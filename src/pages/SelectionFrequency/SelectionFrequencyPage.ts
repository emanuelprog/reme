import { ref, computed, watch } from 'vue';
import { Notify, type QTableColumn } from 'quasar';
import { fetchDisciplines, fetchGrades, fetchGroups, fetchSchools, fetchShifts, fetchTeachingType, fetchYears } from 'src/services/filtersService';
import type { TeachingType, School, Year, Shift, Group, Discipline, Grade, Bimester } from 'src/types/FilterOption';
import { useFilterStore } from 'src/stores/filterStore';
import { fetchDiaryCreationInfo, fetchDiaryGrades } from 'src/services/diaryService';
import type { DiaryGrade } from 'src/types/DiaryGrade';
import axios from 'axios';
import { useDiaryGradeStore } from 'src/stores/diaryStore';
import { useTeacherStore } from 'src/stores/teacherStore';

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

const columns: QTableColumn[] = [
  { name: 'teachingType', label: 'Etapa', field: row => row.teachingType?.description, align: 'left', sortable: true },
  { name: 'school', label: 'Escola', field: row => row.sector, align: 'left', sortable: true },
  { name: 'year', label: 'Ano', field: row => row.createdAt ? new Date(row.createdAt).getFullYear() : '', align: 'left', sortable: true },
  { name: 'shift', label: 'Turno', field: row => row.shift?.description, align: 'left', sortable: true },
  { name: 'group', label: 'Grupo', field: row => row.group?.description, align: 'left', sortable: true },
  { name: 'discipline', label: 'Disciplina', field: row => row.discipline?.description, align: 'left', sortable: true },
  { name: 'grade', label: 'Turma', field: row => row.grade?.description, align: 'left', sortable: true },
  { name: 'bimester', label: 'Bimestre', field: row => row.bimesterPeriod?.bimester, align: 'left', sortable: true },
  {
    name: 'status',
    label: 'Situação',
    field: row => {
      if (row.diaryStatusId === 1) return 'Em Andamento'
      if (row.diaryStatusId === 2) return 'Enviado'
      return 'Finalizado'
    },
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Ações',
    field: row => row,
    align: 'left'
  }
];

const filters = ref<FilterModel>({ ...initialFilters });
const validate = ref(false);
const showTable = ref(false);
const loading = ref(false);

const diaryGrades = ref<DiaryGrade[]>([]);
const paginationCards = ref({ page: 1, rowsPerPage: 2 });

const paginatedCards = computed(() => {
  const start = (paginationCards.value.page - 1) * paginationCards.value.rowsPerPage;
  const end = start + paginationCards.value.rowsPerPage;
  return diaryGrades.value.slice(start, end);
});

const filterStore = useFilterStore();
const diaryStore = useDiaryGradeStore();
const teacherStore = useTeacherStore();

const validationContext = ref<'search' | 'create' | null>(null);

function getDiaryActions(diary: DiaryGrade) {
  if (diary.diaryStatusId === 1) {
    return ['Editar', 'Imprimir', 'Observação']
  }
  return ['Ver', 'Imprimir', 'Observação']
}

function getActionIcon(action: string) {
  switch (action) {
    case 'Editar':
      return 'edit'
    case 'Ver':
      return 'visibility'
    case 'Imprimir':
      return 'print'
    case 'Observação':
      return 'comment'
    default:
      return 'help'
  }
}

function isFieldRequired(fieldKey: string): boolean {
  if (validationContext.value === 'search') {
    return fieldKey === 'school';
  }
  if (validationContext.value === 'create') {
    return true;
  }
  return false;
}

async function loadSelectOptions() {
  showTable.value = false;

  const [teachingTypeRes, schoolRes] = await Promise.all([
    fetchTeachingType(),
    fetchSchools()
  ]);

  selectFields.value.teachingType.options = Array.isArray(teachingTypeRes.data) ? teachingTypeRes.data : [];
  selectFields.value.school.options = Array.isArray(schoolRes.data) ? schoolRes.data : [];
}

watch(
  () => filters.value.teachingType,
  (teachingType) => {
    filters.value.school = null;
    filters.value.year = null;

    filterStore.setSelections(teachingType, null, null, null, null, null, null, null);

    if (!teachingType?.id) {
      resetOptionsFrom('year');
      showTable.value = false;
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
        selectFields.value.year.options = Array.isArray(res.data)
          ? res.data.map((y: number) => ({ value: y, label: String(y) }))
          : [];
      });
    } else {
      resetOptionsFrom('group');
      showTable.value = false;
    }
  }
);

watch(
  () => filters.value.year,
  (year) => {
    filters.value.shift = null;

    filterStore.setSelections(filters.value.teachingType, filters.value.school, year, null, null, null, null, null);

    if (filters.value.teachingType && filters.value.school && year?.value) {
      void fetchShifts().then((res) => {
        const shifts = Array.isArray(res.data) ? res.data : [];

        if (shifts.length === 1 && shifts[0].id === 4) {
          selectFields.value.shift.options = [
            { id: 1, description: 'MATUTINO', situation: true, isIntegral: true },
            { id: 2, description: 'VESPERTINO', situation: true, isIntegral: true },
            { id: 4, description: 'INTEGRAL', situation: true, isIntegral: true }
          ];
        } else {
          selectFields.value.shift.options = shifts;
        }
      });
    } else {
      resetOptionsFrom('shift');
      showTable.value = false;
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
      resetOptionsFrom('grade');
      showTable.value = false;
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
      resetOptionsFrom('discipline');
      showTable.value = false;
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
      resetOptionsFrom('grade');
      showTable.value = false;
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
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];
    } else {
      selectFields.value.bimester.options = [];
      showTable.value = false;
    }
  }
);

watch(
  () => filters.value.bimester,
  (bimester) => {
    filterStore.setSelections(filters.value.teachingType, filters.value.school, filters.value.year, filters.value.shift, filters.value.group, filters.value.discipline, filters.value.grade, bimester);
  }
);

function resetOptionsFrom(field: keyof typeof selectFields.value) {
  const order: (keyof FilterModel)[] = ['year', 'shift', 'group', 'discipline', 'grade', 'bimester'];
  const index = order.indexOf(field);

  order.slice(index).forEach((key) => {
    filters.value[key] = null;

    const selectKey = key as keyof typeof selectFields.value;
    if ('options' in selectFields.value[selectKey]) {
      (selectFields.value[selectKey].options as unknown as unknown[]).length = 0;
    }
  });
}

function clearFilters() {
  filters.value = { ...initialFilters };
  validate.value = false;
  showTable.value = false;

  selectFields.value.year.options = [];
  filterStore.setSelections(null, null, null, null, null, null, null, null);
}

async function onSearch() {
  validationContext.value = 'search';
  validate.value = true;

  if (!filters.value.school) return;

  loading.value = true;
  showTable.value = false;

  try {
    const response = await fetchDiaryGrades();

    diaryGrades.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar diário:', error);
    diaryGrades.value = [];
  } finally {
    loading.value = false;
    showTable.value = true;
  }
}

async function onCreate(): Promise<boolean> {
  validationContext.value = 'create';
  validate.value = true;


  if (!isFilterFilled()) return false;

  try {
    const response = await fetchDiaryCreationInfo();

    const { teacherScheduleId, bimesterPeriod } = response.data;

    if (!teacherStore.selectedTeacher) return false;

    const existingDiaries = await fetchDiaryGrades();

    if (existingDiaries.data) {
      const alreadyExists = existingDiaries.data.some((diary: DiaryGrade) =>
        diary.teacherScheduleId === teacherScheduleId &&
        String(diary.bimesterPeriod?.id) === String(bimesterPeriod.id) &&
        String(diary.enrollment) === String(teacherStore.selectedTeacher?.enrollment)
      );

      if (alreadyExists) {
        Notify.create({
          type: 'warning',
          message: 'Já existe um diário cadastrado com os mesmos dados.',
          position: 'top-right',
          timeout: 1500
        });
        return false;
      }
    }


    const newDiary: DiaryGrade = {
      id: null,
      school: filters.value.school,
      sector: filters.value.school?.sector ?? null,
      group: filters.value.group,
      shift: filters.value.shift,
      grade: filters.value.grade,
      teachingType: filters.value.teachingType,
      substituteTeacherId: teacherStore.selectedTeacher?.substituteTeacherId,
      enrollment: teacherStore.selectedTeacher?.enrollment,
      employmentLink: teacherStore.selectedTeacher?.employmentLink ? teacherStore.selectedTeacher?.employmentLink : teacherStore.selectedTeacher?.holderEmploymentLink,
      bimesterPeriod: bimesterPeriod,
      discipline: filters.value.discipline,
      diaryStatusId: 1,
      teacherScheduleId: teacherScheduleId,
      diaryType: 'F',
      assessmentTypeId: null,
      changeUser: teacherStore.selectedTeacher?.name,
      term: false,
      createdAt: new Date()
    };

    diaryStore.setSelectedDiaryGrade(newDiary);
    return true;
  } catch (error: unknown) {
    let errorMessage = 'Erro ao obter dados do diário.';

    if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
      errorMessage = error.response.data.message;
    }

    console.error('Erro ao buscar dados para criação de diário:', error);
    Notify.create({
      type: 'negative',
      message: errorMessage,
      position: 'top-right',
      timeout: 1000
    });

    return false;
  }
}

function isFilterFilled(): boolean {
  const f = filters.value;

  return !!(
    f.school &&
    f.teachingType &&
    f.year &&
    f.shift &&
    f.group &&
    f.grade &&
    f.discipline &&
    f.bimester
  );
}

export function useSelectionFrequencyPage() {
  return {
    filters,
    selectFields,
    validate,
    showTable,
    loading,
    diaryGrades,
    columns,
    paginationCards,
    paginatedCards,
    isFieldRequired,
    onSearch,
    onCreate,
    clearFilters,
    loadSelectOptions,
    getDiaryActions,
    getActionIcon
  };
}