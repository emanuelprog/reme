export type StudentFrequency = {
  id: number
  name: string
  callNumber: number
  hasOccurrence: boolean
  frequencies: Record<string, {
    id: number
    classTime: string
    date: string
    value: string
  }>
  editableFrequencies: Record<string, {
    editable: boolean
    observation: boolean
  }>
}
