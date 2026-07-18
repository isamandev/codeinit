"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  getCourse,
  getLesson,
  completeLesson,
  type LessonStatus,
} from "@/entities/course";

interface CourseLessonPageProps {
  courseSlug: string;
  lessonId: string;
}

export default function CourseLessonPage({
  courseSlug,
  lessonId,
}: CourseLessonPageProps) {
  const router = useRouter();
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: course, mutate: mutateCourse } = useSWR(
    ["course", courseSlug],
    () => getCourse(courseSlug),
  );
  const { data: lesson } = useSWR(["lesson", courseSlug, lessonId], () =>
    getLesson(courseSlug, lessonId),
  );

  const flatLessons = useMemo(
    () =>
      course?.chapters.flatMap((chapter) =>
        chapter.lessons.map((courseLesson) => ({
          ...courseLesson,
          chapterId: chapter.id,
        })),
      ) ?? [],
    [course],
  );

  const currentChapter = course?.chapters.find((chapter) =>
    chapter.lessons.some((courseLesson) => courseLesson.id === lessonId),
  );

  function isChapterExpanded(chapterId: string): boolean {
    if (chapterId in expandedChapters) return expandedChapters[chapterId];
    return currentChapter?.id === chapterId;
  }

  function toggleChapter(chapterId: string) {
    setExpandedChapters((previous) => ({
      ...previous,
      [chapterId]: !isChapterExpanded(chapterId),
    }));
  }

  function selectLesson(status: LessonStatus, targetLessonId: string) {
    if (status === "locked") return;
    setSidebarOpen(false);
    router.push(`/courses/${courseSlug}/${targetLessonId}`);
  }

  const currentIndex = flatLessons.findIndex(
    (courseLesson) => courseLesson.id === lessonId,
  );
  const previousLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex + 1 < flatLessons.length
      ? flatLessons[currentIndex + 1]
      : null;
  const isNextLessonLocked = nextLesson?.status === "locked";

  async function handleNextLesson() {
    if (!nextLesson || isNextLessonLocked) return;

    const authToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("authToken")
        : null;

    if (authToken) {
      try {
        await completeLesson(courseSlug, lessonId, authToken);
        void mutateCourse();
      } catch {
        // best-effort: still let the user move on even if tracking failed
      }
    }

    router.push(`/courses/${courseSlug}/${nextLesson.id}`);
  }

  function handlePreviousLesson() {
    if (!previousLesson) return;
    router.push(`/courses/${courseSlug}/${previousLesson.id}`);
  }

  if (!course || !lesson) {
    return (
      <div
        dir="ltr"
        className="flex flex-1 items-center justify-center py-24 text-sm"
        style={{ color: "var(--muted-foreground)" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className="relative flex overflow-hidden border"
      style={{
        borderColor: "var(--border)",
        background: "var(--background)",
        minHeight: "min(720px, 80vh)",
      }}
    >
      {/* Mobile top bar */}
      <div
        className="absolute inset-x-0 top-0 z-[110] flex h-[52px] items-center gap-3 border-b-2 px-4 md:hidden"
        style={{ borderColor: "var(--border)", background: "var(--background)" }}
      >
        <button
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="flex-1 truncate text-[15px] font-bold">
          {currentChapter?.title}
        </span>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-[105] bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex w-full pt-[52px] md:pt-0">
        {/* Sidebar */}
        <aside
          className={`absolute inset-y-0 left-0 z-[108] flex w-[88vw] max-w-[320px] flex-col overflow-hidden border-r transition-transform duration-200 md:relative md:z-auto md:w-[300px] md:max-w-none md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ borderColor: "var(--border)", background: "var(--background)" }}
        >
          <div
            className="shrink-0 border-b px-5 pb-4 pt-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="mb-1.5 text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-scarlet-rose)" }}
            >
              {course.description ?? "Programming Course"}
            </div>
            <h2 className="mb-1 text-lg font-bold">{course.title}</h2>
            <div className="text-[13px]" style={{ color: "var(--color-neutral-600)" }}>
              {course.progress.completedCount} of {course.progress.totalCount} lessons complete
            </div>
          </div>

          <div
            className="shrink-0 border-b px-5 py-3.5"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mb-1.5 flex justify-between text-xs font-semibold">
              <span>Progress</span>
              <span>{course.progress.progressPercent}%</span>
            </div>
            <div className="h-1" style={{ background: "var(--color-neutral-200)" }}>
              <div
                className="h-1 transition-[width] duration-300"
                style={{
                  background: "var(--color-scarlet-rose)",
                  width: `${course.progress.progressPercent}%`,
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {course.chapters.map((chapter) => {
              const expanded = isChapterExpanded(chapter.id);
              return (
                <div key={chapter.id}>
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex w-full items-center gap-2.5 border-b px-5 py-2.5 text-left text-[13px] font-bold hover:bg-[var(--color-neutral-100)]"
                    style={{ borderColor: "var(--color-neutral-100)" }}
                  >
                    <span
                      className="shrink-0 text-[10px] transition-transform"
                      style={{
                        color: "var(--color-neutral-500)",
                        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      ▶
                    </span>
                    <span className="flex-1">{chapter.title}</span>
                    <span
                      className="text-[11px] font-normal"
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      {chapter.lessonCount} lessons
                    </span>
                  </button>

                  {expanded && (
                    <div>
                      {chapter.lessons.map((courseLesson) => {
                        const isActive = courseLesson.id === lessonId;
                        const isLocked = courseLesson.status === "locked";
                        return (
                          <button
                            key={courseLesson.id}
                            onClick={() =>
                              selectLesson(courseLesson.status, courseLesson.id)
                            }
                            disabled={isLocked}
                            className="flex w-full items-center gap-2.5 border-l-2 py-2.5 pl-9 pr-5 text-left text-[13px] hover:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed"
                            style={{
                              borderColor: isActive
                                ? "var(--color-scarlet-rose)"
                                : "transparent",
                              background: isActive
                                ? "var(--color-accent-100)"
                                : "transparent",
                              color: isLocked
                                ? "var(--color-neutral-400)"
                                : isActive
                                  ? "var(--color-accent-700)"
                                  : "var(--foreground)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            <span className="flex-1">{courseLesson.title}</span>
                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center text-[11px] font-bold"
                              style={{
                                color:
                                  courseLesson.status === "completed"
                                    ? "var(--color-scarlet-rose)"
                                    : "var(--color-neutral-300)",
                              }}
                            >
                              {courseLesson.status === "completed" && "✓"}
                              {courseLesson.status === "current" && (
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ background: "var(--color-scarlet-rose)" }}
                                />
                              )}
                              {courseLesson.status === "locked" && "○"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div
            className="mb-2 text-[11px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-neutral-500)" }}
          >
            {lesson.chapterTitle}
          </div>
          <h1 className="mb-6 text-[22px] font-bold leading-tight md:text-[32px]">
            {lesson.title}
          </h1>

          <div className="mb-8 max-w-[720px]">
            <div
              className="relative flex aspect-video flex-col items-center justify-center"
              style={{ background: "#201e1d" }}
            >
              <button
                aria-label="Play video"
                className="mb-5 flex h-16 w-16 items-center justify-center text-white"
                style={{ background: "var(--color-scarlet-rose)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <div
                className="px-4 text-center text-[13px] font-semibold"
                style={{ color: "var(--color-neutral-300)" }}
              >
                {lesson.videoLabel ?? `${lesson.title} — Video Lesson`}
              </div>
              {lesson.duration && (
                <div
                  className="mt-1.5 text-xs"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  {lesson.duration}
                </div>
              )}
            </div>
            <div className="h-[3px]" style={{ background: "var(--color-neutral-200)" }}>
              <div className="h-[3px] w-0" style={{ background: "var(--color-scarlet-rose)" }} />
            </div>
          </div>

          <hr className="mb-8 border-t-2" style={{ borderColor: "var(--border)" }} />

          <div
            className="max-w-[720px] text-[15px] leading-relaxed md:text-base"
            style={{ color: "var(--color-neutral-800)" }}
          >
            {lesson.intro && <p className="mb-5">{lesson.intro}</p>}
            {lesson.codeBlock && (
              <pre
                className="mb-5 overflow-x-auto whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed"
                style={{ background: "#201e1d", color: "#f3f2f2" }}
              >
                {lesson.codeBlock}
              </pre>
            )}
            {lesson.body && <p className="mb-5">{lesson.body}</p>}
          </div>

          <div
            className="mt-10 flex flex-col gap-3 border-t-2 pt-6 md:flex-row"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={handlePreviousLesson}
              disabled={!previousLesson}
              className="border-2 px-5 py-3 text-sm font-semibold hover:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            >
              ← Previous
            </button>
            <button
              onClick={handleNextLesson}
              disabled={!nextLesson || isNextLessonLocked}
              className="border-2 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: "var(--color-scarlet-rose)",
                borderColor: "var(--color-scarlet-rose)",
              }}
            >
              Next lesson →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
