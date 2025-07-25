export type StudentFrequency = {
  id: number
  name: string
  callNumber: number
  hasObservation: boolean
  hasOccurrence: boolean
  frequencies: Record<string, {
    value: string
    id?: number
  }>
  editableFrequencies: Record<string, {
    editable: boolean
    observation: boolean
  }>
}

export interface StudentFrequencySaveDTO {
  id: number
  name: string
  callNumber?: number
  hasOccurrence?: boolean
  frequencies: {
    id?: number
    classTime: string
    date: string
    value: string
  }[]
}
