import type { BimesterPeriod } from "./BimesterPeriod";
import type { Discipline, Grade, Group, School, Shift, TeachingType } from "./FilterOption";

export interface DiaryGrade {
    id: number;
    school: School;
    group: Group;
    shift: Shift;
    grade: Grade;
    teachingType: TeachingType;
    substituteTeacherId: number;
    enrollment: string;
    employmentLink: number;
    bimesterPeriod: BimesterPeriod;
    discipline: Discipline;
    teacherScheduleId: number;
    diaryType: string;
    assessmentTypeId: number;
    changeUser: string;
    term: boolean;
    createdAt: Date;
  }

  export interface DiaryGradeFilterPayload {
    enrollment: string | null;
    teachingTypeId: number | null;
    sector: string | null;
    year: number | null;
    shiftId: number | null;
    groupId: number | null;
    disciplineId: number | null;
    gradeId: number | null;
    bimester: number | null;
  }