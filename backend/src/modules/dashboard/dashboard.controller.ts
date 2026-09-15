import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('super-admin')
  @Roles(Role.SUPER_ADMIN)
  superAdmin() {
    return this.dashboardService.superAdmin();
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  admin() {
    return this.dashboardService.admin();
  }

  @Get('instruktur')
  @Roles(Role.INSTRUKTUR)
  instruktur(@CurrentUser() user: AuthUser) {
    return this.dashboardService.instruktur(user.sub);
  }

  @Get('user')
  @Roles(Role.USER)
  user(@CurrentUser() user: AuthUser) {
    return this.dashboardService.user(user.sub);
  }
}
