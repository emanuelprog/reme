import { api } from 'src/boot/axios';
import { useFilterStore } from 'src/stores/filterStore';
import { useTeacherStore } from 'src/stores/teacherStore';

const filterStore = useFilterStore();
const teacherStore = useTeacherStore();

export async function fetchDiaryGrades() {
    const response = await api.get('/diary', { params: {
        enrollment: teacherStore.selectedTeacher?.enrollment ?? null, 
        teachingTypeId: filterStore.selectedTeachingType?.id ?? null,
        sector: filterStore.selectedSchool?.sector ?? null,
        year: filterStore.selectedYear?.value ?? null,
        shiftId: filterStore.selectedShift?.isIntegral ? 4 : filterStore.selectedShift?.id ?? null,
        groupId: filterStore.selectedGroup?.id ?? null,
        disciplineId: filterStore.selectedDiscipline?.id ?? null,
        gradeId: filterStore.selectedGrade?.id ?? null,
        bimester: filterStore.selectedBimester?.value ?? null
      } });
    return response.data;
}

export async function fetchDiaryCreationInfo() {
    const response = await api.get('/diary/info', { params: {
        enrollment: teacherStore.selectedTeacher?.enrollment ?? null, 
        teachingTypeId: filterStore.selectedTeachingType?.id ?? null,
        schoolNumber: filterStore.selectedSchool?.schoolNumber ?? null,
        year: filterStore.selectedYear?.value ?? null,
        shiftId: filterStore.selectedShift?.isIntegral ? 4 : filterStore.selectedShift?.id ?? null,
        bimester: filterStore.selectedBimester?.value ?? null
      } });
    return response.data;
}