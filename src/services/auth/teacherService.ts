import { ref } from 'vue';
import type { Teacher, TeacherOption } from 'src/types/Teacher';

const teacherOptions = ref<TeacherOption[]>([]);
const selectedTeacher = ref<Teacher | null>(null);

const API_URL = import.meta.env.VITE_API;

export async function initTeacherData(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      teacherOptions.value = [];
      selectedTeacher.value = null;
      return false;
    }

    const raw = await response.json();

    console.log(raw);
    
    const data: Teacher[] = Array.isArray(raw.data) ? raw.data : [raw.data];

    teacherOptions.value = data.map((t: Teacher): TeacherOption => ({
      label: t.holderName === t.name ? 'MEU HORÁRIO' : t.holderName,
      value: t
    }));

    const onlyTeacher = data[0];
    if (onlyTeacher) {
      selectedTeacher.value = onlyTeacher;
    }

    return true;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    teacherOptions.value = [];
    selectedTeacher.value = null;
    return false;
  }
}

export function selectTeacher(teacher: Teacher) {
  selectedTeacher.value = teacher;
}

export function useTeachers() {
  return {
    teacherOptions,
    selectedTeacher,
    selectTeacher
  };
}