import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiQuery({ name: 'role', enum: Role, required: false })
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(@Body() dto: CreateUserDto, @CurrentUser() actor: AuthUser) {
    this.assertCanManage(actor.role as Role, dto.role);
    const user = await this.usersService.create(dto);
    await this.auditLogsService.record(actor.sub, 'create', 'users', user.id);
    return user;
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() actor: AuthUser) {
    if (dto.role) this.assertCanManage(actor.role as Role, dto.role);
    const user = await this.usersService.update(id, dto);
    await this.auditLogsService.record(actor.sub, 'update', 'users', id);
    return user;
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() actor: AuthUser) {
    const result = await this.usersService.softDelete(id);
    await this.auditLogsService.record(actor.sub, 'delete', 'users', id);
    return result;
  }

  // Admin hanya boleh mengelola Instruktur & User; Super Admin boleh mengelola Admin juga.
  private assertCanManage(actorRole: Role, targetRole: Role) {
    if (actorRole === Role.SUPER_ADMIN) return;
    if (actorRole === Role.ADMIN && [Role.INSTRUKTUR, Role.USER].includes(targetRole)) return;
    throw new ForbiddenException('Anda tidak memiliki akses untuk mengelola role ini');
  }
}
