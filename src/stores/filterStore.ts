import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TeachingType, School, Year } from 'src/types/FilterOption';

export const useFilterStore = defineStore('filter', () => {
  const selectedTeachingType = ref<TeachingType | null>(null);
  const selectedSchool = ref<School | null>(null);
  const selectedYear = ref<Year | null>(null);

  function setSelections(teachingType: TeachingType | null, school: School | null, year: Year | null) {
    selectedTeachingType.value = teachingType;
    selectedSchool.value = school;
    selectedYear.value = year;
  }

  return {
    selectedTeachingType,
    selectedSchool,
    selectedYear,
    setSelections
  };
});