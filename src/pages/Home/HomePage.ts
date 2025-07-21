import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTeachers } from 'src/services/auth/teacherService';
import type { TeacherOption } from 'src/types/Teacher';

export function useHomePage() {
  const router = useRouter();
  const { teacherOptions, selectTeacher, selectedTeacher } = useTeachers();

  const selectedOption = ref<TeacherOption | null>(null);

  const hasOwnSchedule = computed(() =>
    teacherOptions.value.some((t: { label: string }) => t.label === 'MEU HORÁRIO')
  );

  function onTeacherSelect(option: TeacherOption) {
    selectedOption.value = option;
    selectTeacher(option.value);
  }

  async function goTo(path: string) {
    await router.push(`/${path}`);
  }

  const cards = [
    {
      icon: 'edit_calendar',
      title: 'Plano de Aula',
      description: 'Cadastre e consulte seus planos de aula por disciplina e turma.',
      route: 'lesson-plan'
    },
    {
      icon: 'event_available',
      title: 'Frequência',
      description: 'Cadastre e consulte a presença dos alunos por data e turma.',
      route: 'frequency'
    },
    {
      icon: 'calculate',
      title: 'Médias',
      description: 'Cadastre e consulte as médias bimestrais dos alunos.',
      route: 'averages'
    }
  ];

  return {
    teacherOptions,
    selectedOption,
    selectedTeacher,
    hasOwnSchedule,
    onTeacherSelect,
    goTo,
    cards
  };
}