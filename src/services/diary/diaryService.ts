import { api } from 'src/boot/axios';
import type { DiaryGradeFilterPayload } from 'src/types/DiaryGrade';

export async function fetchDiaryGrades(params: DiaryGradeFilterPayload) {
    const response = await api.get('/diary', { params });
    return response.data;
}