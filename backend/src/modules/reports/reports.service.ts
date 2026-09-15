import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { UpsertGradeDto } from './dto/upsert-grade.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class ReportsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private baseQuery() {
    return this.knex('grades as g')
      .join('users as u', 'u.id', 'g.user_id')
      .join('courses as c', 'c.id', 'g.course_id')
      .select('g.*', 'u.name as user_name', 'c.title as course_title');
  }

  findByUser(userId: string) {
    return this.baseQuery().where('g.user_id', userId);
  }

  findByCourse(courseId: string) {
    return this.baseQuery().where('g.course_id', courseId);
  }

  async upsert(dto: UpsertGradeDto, actor: AuthUser) {
    if (actor.role === Role.INSTRUKTUR) {
      const course = await this.knex('courses').where('id', dto.course_id).first();
      if (!course || course.instructor_id !== actor.sub) {
        throw new ForbiddenException('Anda hanya bisa menilai kelas yang Anda ampu');
      }
    }

    const existing = await this.knex('grades')
      .where({ user_id: dto.user_id, course_id: dto.course_id })
      .first();

    if (existing) {
      await this.knex('grades').where('id', existing.id).update({
        final_score: dto.final_score ?? existing.final_score,
        certificate_issued: dto.certificate_issued ?? existing.certificate_issued,
      });
      return this.knex('grades').where('id', existing.id).first();
    }

    const id = uuidv4();
    await this.knex('grades').insert({
      id,
      user_id: dto.user_id,
      course_id: dto.course_id,
      final_score: dto.final_score ?? null,
      certificate_issued: dto.certificate_issued ?? false,
    });
    return this.knex('grades').where('id', id).first();
  }

  async generateCertificate(userId: string, courseId: string): Promise<Buffer> {
    const grade = await this.knex('grades').where({ user_id: userId, course_id: courseId }).first();
    if (!grade || !grade.certificate_issued) {
      throw new NotFoundException('Sertifikat belum tersedia untuk kelas ini');
    }
    const user = await this.knex('users').where('id', userId).first();
    const course = await this.knex('courses').where('id', courseId).first();

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(28).text('Sertifikat Penyelesaian', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(16).text('Diberikan kepada', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(24).text(user.name, { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(14).text(`Telah menyelesaikan kelas "${course.title}"`, { align: 'center' });
      if (grade.final_score != null) {
        doc.moveDown(0.5);
        doc.text(`Nilai Akhir: ${grade.final_score}`, { align: 'center' });
      }
      doc.moveDown(2);
      doc.fontSize(10).text(`Diterbitkan pada ${new Date().toLocaleDateString('id-ID')}`, {
        align: 'center',
      });
      doc.end();
    });
  }
}
