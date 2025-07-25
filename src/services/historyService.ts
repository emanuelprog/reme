import { api } from 'src/boot/axios'

export async function findHistoriesByStudent(studentId: number) {
    const response = await api.get(`/histories/student/${studentId}`)
    return response.data
}