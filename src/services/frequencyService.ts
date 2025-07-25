import { api } from 'src/boot/axios';
import { useDiaryGradeStore } from 'src/stores/diaryStore';
import { useFilterStore } from 'src/stores/filterStore';
import type { FrequencyRequest } from 'src/types/FrequencyResponse';

const diaryStore = useDiaryGradeStore();
const filterStore = useFilterStore();

export async function fetchFrequencies() {
  const response = await api.get('/frequencies', {
    params: {
      teacherScheduleId: diaryStore.selectedDiaryGrade?.teacherScheduleId ?? null,
      disciplineId: diaryStore.selectedDiaryGrade?.discipline?.id ?? null,
      sector: diaryStore.selectedDiaryGrade?.sector ?? null,
      group: diaryStore.selectedDiaryGrade?.group?.description ?? null,
      grade: diaryStore.selectedDiaryGrade?.grade?.description ?? null,
      shift: diaryStore.selectedDiaryGrade?.shift?.description ?? null,
      year: filterStore.selectedYear?.value ?? null,
      from: diaryStore.selectedDiaryGrade?.bimesterPeriod?.startDate ?? null,
      to: diaryStore.selectedDiaryGrade?.bimesterPeriod?.endDate ?? null
    }
  });

  return response.data.data;
}

export async function saveFrequencies(frequencyRequest: FrequencyRequest) {
  const response = await api.post('/frequencies', frequencyRequest)
  return response.data
}