import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { AuthUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class DashboardService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async superAdmin() {
    const [{ count: totalUsers }] = await this.knex('users').whereNull('deleted_at').count('id as count');
    const [{ count: activeCourses }] = await this.knex('courses')
      .whereNull('deleted_at')
      .andWhere('status', 'active')
      .count('id as count');
    const recentActivity = await this.knex('audit_logs')
      .leftJoin('users', 'users.id', 'audit_logs.user_id')
      .select('audit_logs.*', 'users.name as user_name')
      .orderBy('audit_logs.created_at', 'desc')
      .limit(10);
    return { totalUsers: Number(totalUsers), activeCourses: Number(activeCourses), recentActivity };
  }

  async admin() {
    const [{ count: newUsers }] = await this.knex('users')
      .whereNull('deleted_at')
      .andWhere('created_at', '>=', this.knex.raw("now() - interval '30 days'"))
      .count('id as count');
    const [{ count: runningCourses }] = await this.knex('courses')
      .whereNull('deleted_at')
      .andWhere('status', 'active')
      .count('id as count');
    const [{ count: pendingApprovals }] = await this.knex('enrollments')
      .where('status', 'pending')
      .count('id as count');
    const [{ count: activeInstructors }] = await this.knex('users')
      .whereNull('deleted_at')
      .andWhere({ role: 'instruktur', status: 'active' })
      .count('id as count');
    return {
      newUsers: Number(newUsers),
      runningCourses: Number(runningCourses),
      pendingApprovals: Number(pendingApprovals),
      activeInstructors: Number(activeInstructors),
    };
  }

  async instruktur(instructorId: string) {
    const courses = await this.knex('courses').where('instructor_id', instructorId).whereNull('deleted_at');
    const courseIds = courses.map((c) => c.id);

    const ungradedAssignments = courseIds.length
      ? await this.knex('assignment_submissions as s')
          .join('assignments as a', 'a.id', 's.assignment_id')
          .whereIn('a.course_id', courseIds)
          .whereNull('s.grade')
          .whereNull('s.deleted_at')
          .count('s.id as count')
          .first()
      : { count: 0 };

    const upcomingSchedules = courseIds.length
      ? await this.knex('schedules')
          .whereIn('course_id', courseIds)
          .andWhere('start_time', '>=', new Date())
          .orderBy('start_time', 'asc')
          .limit(5)
      : [];

    return {
      coursesCount: courses.length,
      courses,
      ungradedAssignments: Number(ungradedAssignments?.count ?? 0),
      upcomingSchedules,
    };
  }

  async user(userId: string) {
    const enrollments = await this.knex('enrollments as e')
      .join('courses as c', 'c.id', 'e.course_id')
      .where('e.user_id', userId)
      .select('e.*', 'c.title as course_title');

    const courseIds = enrollments.map((e) => e.course_id);

    const upcomingDeadlines = courseIds.length
      ? await this.knex('schedules')
          .whereIn('course_id', courseIds)
          .andWhere('type', 'deadline')
          .andWhere('start_time', '>=', new Date())
          .orderBy('start_time', 'asc')
          .limit(5)
      : [];

    const grades = await this.knex('grades').where('user_id', userId);

    return {
      enrollments,
      upcomingDeadlines,
      grades,
    };
  }
}
