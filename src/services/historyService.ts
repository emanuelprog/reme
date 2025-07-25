import { api } from 'src/boot/axios'
import type { History } from 'src/types/History'

export async function findHistoriesByStudent(studentId: number): Promise<History[]> {
    const response = await api.get(`/histories/student/${studentId}`)
    return response.data
}