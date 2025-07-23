import { api } from 'boot/axios';
import { useFilterStore } from 'src/stores/filterStore';
import { useTeacherStore } from 'src/stores/teacherStore';

const filterStore = useFilterStore();
const teacherStore = useTeacherStore();

export async function fetchTeachingType() {
    const response = await api.get('/filter/teachingType');
    return response.data;
  }
  
  export async function fetchSchools() {
    const response = await api.get('/filter/school', {
      params: {
        enrollment: teacherStore.selectedTeacher?.enrollment,
        isCoordinator: teacherStore.selectedTeacher?.isCoordinator
      }
    });

    return response.data;
  }
  
  export async function fetchYears() {
    const response = await api.get('/filter/year', {
      params: {
        teachingTypeId: filterStore.selectedTeachingType?.id,
        schoolNumber: filterStore.selectedSchool?.schoolNumber,
        enrollment: teacherStore.selectedTeacher?.enrollment
      }
    });

    return response.data;
  }
  
  export async function fetchShifts() {
    const response = await api.get('/filter/shift', {
      params: {
        teachingTypeId: filterStore.selectedTeachingType?.id,
        schoolNumber: filterStore.selectedSchool?.schoolNumber,
        enrollment: teacherStore.selectedTeacher?.enrollment,
        year: filterStore.selectedYear?.value
      }
    });

    return response.data;
  }

  export async function fetchGroups() {
    const response = await api.get('/filter/group', {
      params: {
        teachingTypeId: filterStore.selectedTeachingType?.id,
        schoolNumber: filterStore.selectedSchool?.schoolNumber,
        enrollment: teacherStore.selectedTeacher?.enrollment,
        year: filterStore.selectedYear?.value,
        shiftId: filterStore.selectedShift?.id
      }
    });

    return response.data;
  }

  export async function fetchDisciplines() {
    const response = await api.get('/filter/discipline', {
      params: {
        teachingTypeId: filterStore.selectedTeachingType?.id,
        schoolNumber: filterStore.selectedSchool?.schoolNumber,
        enrollment: teacherStore.selectedTeacher?.enrollment,
        year: filterStore.selectedYear?.value,
        shiftId: filterStore.selectedShift?.id,
        groupId: filterStore.selectedGroup?.id
      }
    });

    return response.data;
  }

  export async function fetchGrades() {
    const response = await api.get('/filter/grade', {
      params: {
        teachingTypeId: filterStore.selectedTeachingType?.id,
        schoolNumber: filterStore.selectedSchool?.schoolNumber,
        enrollment: teacherStore.selectedTeacher?.enrollment,
        year: filterStore.selectedYear?.value,
        shiftId: filterStore.selectedShift?.id,
        groupId: filterStore.selectedGroup?.id,
        disciplineId: filterStore.selectedDiscipline?.id
      }
    });

    return response.data;
  }