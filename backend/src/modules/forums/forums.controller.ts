import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ForumsService } from './forums.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';

@ApiTags('forums')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Get()
  @ApiQuery({ name: 'courseId', required: true })
  findByCourse(@Query('courseId') courseId: string) {
    return this.forumsService.findByCourse(courseId);
  }

  @Post()
  create(@Body() dto: CreateForumPostDto, @CurrentUser() user: AuthUser) {
    return this.forumsService.create(dto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumsService.remove(id);
  }
}
