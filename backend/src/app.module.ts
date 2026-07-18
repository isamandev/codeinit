import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./features/auth/auth.module";
import { CoursesModule } from "./features/courses/courses.module";
import { NotificationsModule } from "./features/notifications/notifications.module";
import { UsersModule } from "./features/users/users.module";

@Module({
  imports: [AuthModule, CoursesModule, NotificationsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
