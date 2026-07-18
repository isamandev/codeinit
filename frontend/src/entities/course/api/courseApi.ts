import type { Course, LessonContent, ProgressSummary } from "../model/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function getCourse(
  courseSlug: string,
  authToken?: string,
): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseSlug}`, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
  });
  return parseJsonResponse<Course>(response);
}

export async function getLesson(
  courseSlug: string,
  lessonId: string,
): Promise<LessonContent> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/courses/${courseSlug}/lessons/${lessonId}`,
  );
  return parseJsonResponse<LessonContent>(response);
}

export async function completeLesson(
  courseSlug: string,
  lessonId: string,
  authToken: string,
): Promise<ProgressSummary> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/courses/${courseSlug}/lessons/${lessonId}/complete`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  return parseJsonResponse<ProgressSummary>(response);
}
