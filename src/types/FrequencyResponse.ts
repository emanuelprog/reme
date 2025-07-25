import type { DiaryGrade } from "./DiaryGrade"
import type { StudentFrequency } from "./StudentFrequency"

export type FrequencyResponse = {
  students: StudentFrequency[]
  dateColumns: string[]
}

export type FrequencySavePayload = {
  diaryGrade: DiaryGrade
  frequencies: {
    id: number
    name: string
    callNumber: number
    hasOccurrence: boolean
    frequencies: {
      id: number | undefined
      classTime: string
      date: string
      value: string
    }[]
  }[]
}
