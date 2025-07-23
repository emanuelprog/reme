import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TeachingType, School, Year, Shift, Group, Discipline, Grade, Bimester } from 'src/types/FilterOption';

export const useFilterStore = defineStore('filter', () => {
  const selectedTeachingType = ref<TeachingType | null>(null);
  const selectedSchool = ref<School | null>(null);
  const selectedYear = ref<Year | null>(null);
  const selectedShift = ref<Shift | null>(null);
  const selectedGroup = ref<Group | null>(null);
  const selectedDiscipline = ref<Discipline | null>(null);
  const selectedGrade = ref<Grade | null>(null);
  const selectedBimester = ref<Bimester | null>(null);

  function setSelections(teachingType: TeachingType | null, school: School | null, year: Year | null, shift: Shift | null, 
    group: Group | null, discipline: Discipline | null, grade: Grade | null, bimester: Bimester | null) {
    selectedTeachingType.value = teachingType;
    selectedSchool.value = school;
    selectedYear.value = year;
    selectedShift.value = shift;
    selectedGroup.value = group;
    selectedDiscipline.value = discipline;
    selectedGrade.value = grade;
    selectedBimester.value = bimester;
  }

  return {
    selectedTeachingType,
    selectedSchool,
    selectedYear,
    selectedShift,
    selectedGroup,
    selectedDiscipline,
    selectedGrade,
    selectedBimester,
    setSelections
  };
});