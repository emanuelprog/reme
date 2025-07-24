import type { DiaryGrade } from "./DiaryGrade"
import type { StudentFrequency } from "./StudentFrequency"

export type FrequencyResponse = {
  students: StudentFrequency[]
  dateColumns: string[]
}

export type FrequencyEntry = {
  classTime: string
  date: string
  value: string
}

export type StudentFrequencyPayload = {
  id: number
  name: string
  callNumber: number
  frequencies: FrequencyEntry[]
}

export type FrequencySavePayload = {
  frequencies: StudentFrequencyPayload[],
  diaryGrade: DiaryGrade
}