export type StudentFrequency = {
  id: number
  name: string
  registration: string
  status: string
  hasObservation: boolean
  frequencies: Record<string, string>
  editableFrequencies: Record<string, boolean>
}
