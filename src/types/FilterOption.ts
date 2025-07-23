export interface TeachingType {
  id: number;
  description: string;
}

export interface School {
  sector: string;
  sectorName: string;
  schoolNumber: number;
}

export interface Year {
  label: string;
  value: number;
}

export interface Shift {
  id: number;
  description: string;
  situation: boolean;
  isIntegral: boolean;
}

export interface Group {
  id: number;
  description: string;
  teachingTypeId: number;
}

export interface Discipline {
  id: number;
  description: string;
  situation: boolean;
  teachingTypeId: number;
  disciplineDbeduId: number;
}

export interface Grade {
  id: number;
  description: string;
  situation: boolean;
}

export interface Bimester {
  label: string;
  value: number;
}