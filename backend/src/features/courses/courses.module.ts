import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { PrismaService } from "../../shared/prisma/prisma.service";
import { JwtStrategy } from "../../shared/strategies/jwt.strategy";

@Module({
  imports: [PassportModule],
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService, JwtStrategy],
})
export class CoursesModule {}
