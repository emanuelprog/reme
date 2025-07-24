export type StudentFrequency = {
  id: number
  name: string
  callNumber: number
  hasObservation: boolean
  hasOccurrence: boolean
  frequencies: Record<string, string>
  editableFrequencies: Record<string, {
    editable: boolean
    observation: boolean
  }>
}
