export interface Teacher {
  cpf : string
  nome: string
  vinculo: number
  numero: string 
  ativo: string
  professor_substitutoid: number
  nome_substituido: string
  cpf_substituto: string
  coordenador: boolean
  substitutoExisteErgon: boolean
  }
  
  export interface TeacherOption {
    label: string;
    value: Teacher;
  }