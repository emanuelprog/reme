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
        sector: filterStore.selectedSchool?.sector,
        enrollment: teacherStore.selectedTeacher?.enrollment
      }
    });

    return response.data;
  }
  
  export async function fetchShifts() {
    const response = await api.get('/filter/shifts');
    return response.data;
  }
  
  export async function fetchGroups() {
    const response = await api.get('/filter/groups');
    return response.data;
  }
  
  export async function fetchDisciplines() {
    const response = await api.get('/filter/disciplines');
    return response.data;
  }
  
  export async function fetchClasses() {
    const response = await api.get('/filter/classes');
    return response.data;
  }
  
  export async function fetchBimesters() {
    const response = await api.get('/filter/bimesters');
    return response.data;
  }