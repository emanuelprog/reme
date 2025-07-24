export interface Teacher {
  cpf: string
  name: string
  employmentLink: number
  enrollment: string
  substituteTeacherId: number
  holderName: string
  holderCpf: string
  holderEmploymentLink: number
  isCoordinator: boolean
}

export interface TeacherOption {
  label: string;
  value: Teacher;
}