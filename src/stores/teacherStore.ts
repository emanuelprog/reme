import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Teacher } from 'src/types/Teacher';

export const useTeacherStore = defineStore('teacher', () => {
  const selectedTeacher = ref<Teacher | null>(null);

  function setSelectedTeacher(teacher: Teacher | null) {
    selectedTeacher.value = teacher;
  }

  return {
    selectedTeacher,
    setSelectedTeacher
  };
});