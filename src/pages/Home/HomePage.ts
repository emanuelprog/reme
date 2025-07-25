import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTeachers } from 'src/services/authService';
import type { TeacherOption } from 'src/types/Teacher';
import { useTeacherStore } from 'src/stores/teacherStore';

const teacherStore = useTeacherStore();

export function useHomePage() {
  const router = useRouter();
  const { teacherOptions, selectTeacher } = useTeachers();

  const selectedOption = ref<TeacherOption | null>(null);

  const hasOwnSchedule = computed(() =>
    teacherOptions.value.some((t: { label: string }) => t.label === 'MEU HORÁRIO')
  );

  const cards = [
    {
      icon: 'edit_calendar',
      title: 'Plano de Aula',
      description: 'Cadastre e consulte seus planos de aula por disciplina e turma.',
      route: 'selection-lesson-plan'
    },
    {
      icon: 'event_available',
      title: 'Frequência',
      description: 'Cadastre e consulte a presença dos alunos por data e turma.',
      route: 'selection-frequency'
    },
    {
      icon: 'calculate',
      title: 'Médias',
      description: 'Cadastre e consulte as médias bimestrais dos alunos.',
      route: 'selection-averages'
    }
  ];

  const selectError = ref(false);
  const selectErrorMessage = ref('');

  function onTeacherSelect(option: TeacherOption) {
    selectedOption.value = option;
    selectTeacher(option.value);

    selectError.value = false;
    selectErrorMessage.value = '';
  }

  async function goTo(path: string) {
    if (teacherOptions.value.length > 1 && !selectedOption.value) {
      selectError.value = true;
      selectErrorMessage.value = 'O campo Professor(a) é obrigatório';
      return;
    }

    selectError.value = false;
    selectErrorMessage.value = '';
    await router.push(`/${path}`);
  }

  if (teacherStore.selectedTeacher) {
    selectedOption.value = {
      label: teacherStore.selectedTeacher.holderName,
      value: teacherStore.selectedTeacher
    };
  } else {
    selectedOption.value = null;
  }

  return {
    teacherOptions,
    selectedOption,
    teacherStore,
    hasOwnSchedule,
    onTeacherSelect,
    goTo,
    cards,
    selectError,
    selectErrorMessage
  };
}