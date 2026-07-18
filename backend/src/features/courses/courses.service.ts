import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";

type LessonStatus = "completed" | "current" | "locked";

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private async loadCourseWithTree(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException("دوره یافت نشد");
    }

    return course;
  }

  private async getCompletedLessonIds(
    userId: string | null,
    lessonIds: string[],
  ): Promise<Set<string>> {
    if (!userId) return new Set();

    const completedRows = await this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
      select: { lessonId: true },
    });

    return new Set(completedRows.map((row) => row.lessonId));
  }

  private computeLessonStatuses(
    orderedLessonIds: string[],
    completedLessonIds: Set<string>,
  ): Map<string, LessonStatus> {
    const statusByLessonId = new Map<string, LessonStatus>();
    let currentAssigned = false;

    for (const lessonId of orderedLessonIds) {
      if (completedLessonIds.has(lessonId)) {
        statusByLessonId.set(lessonId, "completed");
        continue;
      }

      if (!currentAssigned) {
        statusByLessonId.set(lessonId, "current");
        currentAssigned = true;
      } else {
        statusByLessonId.set(lessonId, "locked");
      }
    }

    return statusByLessonId;
  }

  async getCourseTree(slug: string, userId: string | null) {
    const course = await this.loadCourseWithTree(slug);

    const orderedLessonIds = course.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => lesson.id),
    );
    const completedLessonIds = await this.getCompletedLessonIds(
      userId,
      orderedLessonIds,
    );
    const statusByLessonId = this.computeLessonStatuses(
      orderedLessonIds,
      completedLessonIds,
    );

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      progress: this.buildProgressSummary(
        orderedLessonIds.length,
        completedLessonIds.size,
      ),
      chapters: course.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        lessonCount: chapter.lessons.length,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          status: statusByLessonId.get(lesson.id) ?? "locked",
        })),
      })),
    };
  }

  async getLesson(slug: string, lessonId: string) {
    const course = await this.loadCourseWithTree(slug);
    const chapter = course.chapters.find((c) =>
      c.lessons.some((lesson) => lesson.id === lessonId),
    );
    const lesson = chapter?.lessons.find((l) => l.id === lessonId);

    if (!chapter || !lesson) {
      throw new NotFoundException("درس یافت نشد");
    }

    return {
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      videoLabel: lesson.videoLabel,
      intro: lesson.intro,
      codeBlock: lesson.codeBlock,
      body: lesson.body,
      chapterTitle: chapter.title,
    };
  }

  async completeLesson(slug: string, lessonId: string, userId: string) {
    const course = await this.loadCourseWithTree(slug);
    const orderedLessonIds = course.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => lesson.id),
    );

    if (!orderedLessonIds.includes(lessonId)) {
      throw new NotFoundException("درس یافت نشد");
    }

    const completedLessonIds = await this.getCompletedLessonIds(
      userId,
      orderedLessonIds,
    );
    const statusByLessonId = this.computeLessonStatuses(
      orderedLessonIds,
      completedLessonIds,
    );

    if (statusByLessonId.get(lessonId) === "locked") {
      throw new BadRequestException(
        "این درس هنوز باز نشده است و نمی‌توان آن را کامل کرد",
      );
    }

    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {},
      create: { userId, lessonId },
    });

    const updatedCompletedLessonIds = await this.getCompletedLessonIds(
      userId,
      orderedLessonIds,
    );

    return this.buildProgressSummary(
      orderedLessonIds.length,
      updatedCompletedLessonIds.size,
    );
  }

  private buildProgressSummary(totalCount: number, completedCount: number) {
    const progressPercent =
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return { completedCount, totalCount, progressPercent };
  }
}
