import { Controller, Get, Post, Param, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CoursesService } from "./courses.service";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../../shared/guards/optional-jwt-auth.guard";

type JwtUser = { userId: string; email: string };

type RequestWithOptionalUser = Omit<Request, "user"> & {
  user?: JwtUser | null;
};

type RequestWithUser = Omit<Request, "user"> & {
  user: JwtUser;
};

@ApiTags("Courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: "Get a course's lesson tree by slug (auth optional)" })
  @ApiParam({ name: "slug", description: "Course slug" })
  @ApiResponse({ status: 200, description: "Course tree retrieved successfully" })
  @ApiResponse({ status: 404, description: "Course not found" })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(":slug")
  getCourse(
    @Param("slug") slug: string,
    @Req() request: RequestWithOptionalUser,
  ) {
    return this.coursesService.getCourseTree(
      slug,
      request.user?.userId ?? null,
    );
  }

  @ApiOperation({ summary: "Get a single lesson within a course" })
  @ApiParam({ name: "slug", description: "Course slug" })
  @ApiParam({ name: "lessonId", description: "Lesson identifier" })
  @ApiResponse({ status: 200, description: "Lesson retrieved successfully" })
  @ApiResponse({ status: 404, description: "Course or lesson not found" })
  @Get(":slug/lessons/:lessonId")
  getLesson(
    @Param("slug") slug: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.coursesService.getLesson(slug, lessonId);
  }

  @ApiOperation({ summary: "Mark a lesson as completed for the current user" })
  @ApiParam({ name: "slug", description: "Course slug" })
  @ApiParam({ name: "lessonId", description: "Lesson identifier" })
  @ApiResponse({ status: 200, description: "Lesson marked as completed" })
  @ApiResponse({ status: 401, description: "Missing or invalid JWT token" })
  @ApiResponse({ status: 404, description: "Course or lesson not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":slug/lessons/:lessonId/complete")
  completeLesson(
    @Param("slug") slug: string,
    @Param("lessonId") lessonId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.coursesService.completeLesson(
      slug,
      lessonId,
      request.user.userId,
    );
  }
}
