import { ref } from 'vue';
import type { Teacher, TeacherOption } from 'src/types/Teacher';
import { api } from 'boot/axios';
import { useTeacherStore } from 'src/stores/teacherStore';

const teacherOptions = ref<TeacherOption[]>([]);
const teacherStore = useTeacherStore();

export async function initTeacherData(): Promise<boolean> {
  try {
    const response = await api.get('/auth');

    const raw = await response.data;

    const data: Teacher[] = Array.isArray(raw.data) ? raw.data : [raw.data];

    teacherOptions.value = data.map((t: Teacher): TeacherOption => ({
      label: t.holderName === t.name ? 'MEU HORÁRIO' : t.holderName,
      value: t
    }));

    if (data.length == 1) {
      const onlyTeacher = data[0];
      if (onlyTeacher) {
        teacherStore.setSelectedTeacher(onlyTeacher);
      }
    }

    return true;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    teacherOptions.value = [];
    teacherStore.setSelectedTeacher(null);
    return false;
  }
}

export function selectTeacher(teacher: Teacher) {
  teacherStore.setSelectedTeacher(teacher);
}

export function useTeachers() {
  return {
    teacherOptions,
    selectTeacher
  };
}