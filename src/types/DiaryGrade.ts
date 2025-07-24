import type { BimesterPeriod } from "./BimesterPeriod";
import type { Discipline, Grade, Group, School, Shift, TeachingType } from "./FilterOption";

export interface DiaryGrade {
  id: number | null;
  school: School | null;
  sector: string | null;
  group: Group | null;
  shift: Shift | null;
  grade: Grade | null;
  teachingType: TeachingType | null;
  substituteTeacherId: number | null;
  enrollment: string | null;
  employmentLink: number | null;
  bimesterPeriod: BimesterPeriod | null;
  discipline: Discipline | null;
  diaryStatusId: number | null;
  teacherScheduleId: number | null;
  diaryType: string | null;
  assessmentTypeId: number | null;
  changeUser: string | null;
  term: boolean | null;
  createdAt: Date | null;
}