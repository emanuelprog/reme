import type { StudentFrequency } from "./StudentFrequency"

export type FrequencyResponse = {
  students: StudentFrequency[]
  dateColumns: string[]
}
