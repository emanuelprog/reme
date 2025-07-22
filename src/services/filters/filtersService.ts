import { api } from 'boot/axios';
import type { School, TeachingType } from 'src/types/FilterOption';
import type { Teacher } from 'src/types/Teacher';

export async function fetchTeachingType() {
    const response = await api.get('/filter/teachingType');
    return response.data;
  }
  
  export async function fetchSchools(teacher: Teacher) {
    const response = await api.get('/filter/school', {
      params: {
        enrollment: teacher.enrollment,
        isCoordinator: teacher.isCoordinator
      }
    });

    return response.data;
  }
  
  export async function fetchYears(teachingType: TeachingType, school: School, teacher: Teacher) {
    const response = await api.get('/filter/year', {
      params: {
        teachingTypeId: teachingType.id,
        sector: school.sector,
        enrollment: teacher.enrollment
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