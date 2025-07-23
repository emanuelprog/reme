import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DiaryGrade } from 'src/types/DiaryGrade';

export const useDiaryGradeStore = defineStore('diaryGrade', () => {
  const selectedDiaryGrade = ref<DiaryGrade | null>(null);

  function setSelectedDiaryGrade(teacher: DiaryGrade | null) {
    selectedDiaryGrade.value = teacher;
  }

  return {
    selectedDiaryGrade,
    setSelectedDiaryGrade
  };
});