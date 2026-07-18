export type LessonStatus = "completed" | "current" | "locked";

export interface CourseLessonSummary {
  id: string;
  title: string;
  status: LessonStatus;
}

export interface CourseChapter {
  id: string;
  title: string;
  lessonCount: number;
  lessons: CourseLessonSummary[];
}

export interface ProgressSummary {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  progress: ProgressSummary;
  chapters: CourseChapter[];
}

export interface LessonContent {
  id: string;
  title: string;
  duration: string | null;
  videoLabel: string | null;
  intro: string | null;
  codeBlock: string | null;
  body: string | null;
  chapterTitle: string;
}
