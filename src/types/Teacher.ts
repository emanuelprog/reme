export interface Teacher {
  cpf : string
  name: string
  employmentLink: number
  enrollment: string 
  substituteTeacherId: number
  holderName: string
  holderCpf: string
  isCoordinator: boolean
  }
  
  export interface TeacherOption {
    label: string;
    value: Teacher;
  }