import type { DiaryGrade } from "./DiaryGrade"
import type { StudentFrequency } from "./StudentFrequency"

export type FrequencyResponse = {
  studentsFrequency: StudentFrequency[]
  dateColumns: string[]
  diaryGrade: DiaryGrade
}

export type FrequencyRequest = {
  studentsFrequency: StudentFrequency[]
  diaryGrade: DiaryGrade
}