import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AttendanceService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findBySchedule(scheduleId: string) {
    return this.knex('attendance as a')
      .join('users as u', 'u.id', 'a.user_id')
      .where('a.schedule_id', scheduleId)
      .select('a.*', 'u.name as user_name');
  }

  async record(scheduleId: string, dto: RecordAttendanceDto, actor: AuthUser) {
    const schedule = await this.knex('schedules').where('id', scheduleId).first();
    if (!schedule) throw new NotFoundException('Jadwal tidak ditemukan');

    if (actor.role === Role.INSTRUKTUR) {
      const course = await this.knex('courses').where('id', schedule.course_id).first();
      if (!course || course.instructor_id !== actor.sub) {
        throw new ForbiddenException('Anda hanya bisa mengisi absensi kelas yang Anda ampu');
      }
    }

    await this.knex.transaction(async (trx) => {
      for (const entry of dto.entries) {
        const existing = await trx('attendance')
          .where({ schedule_id: scheduleId, user_id: entry.user_id })
          .first();
        if (existing) {
          await trx('attendance').where('id', existing.id).update({ status: entry.status });
        } else {
          await trx('attendance').insert({
            id: uuidv4(),
            schedule_id: scheduleId,
            user_id: entry.user_id,
            status: entry.status,
          });
        }
      }
    });

    return this.findBySchedule(scheduleId);
  }
}
