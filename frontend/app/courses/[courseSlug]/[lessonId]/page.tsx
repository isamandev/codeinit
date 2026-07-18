import { CourseLessonPage } from "@/_pages/courses";

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  return <CourseLessonPage courseSlug={courseSlug} lessonId={lessonId} />;
}
