import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from './database/knex.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ForumsModule } from './modules/forums/forums.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KnexModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    CoursesModule,
    EnrollmentsModule,
    MaterialsModule,
    QuizzesModule,
    AssignmentsModule,
    SchedulesModule,
    AnnouncementsModule,
    ForumsModule,
    AttendanceModule,
    ReportsModule,
    AuditLogsModule,
    DashboardModule,
    UploadsModule,
  ],
})
export class AppModule {}
