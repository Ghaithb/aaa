import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('events/:eventId/tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
export class TasksController {
  constructor(private readonly svc: TasksService) {}
  @Get()    findAll(@Param('eventId') eventId: string, @Request() req: any)                     { return this.svc.findAll(eventId, req.user.userId); }
  @Post()   create(@Param('eventId') eventId: string, @Body() dto: CreateTaskDto, @Request() req: any) { return this.svc.create(eventId, dto, req.user.userId); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req: any) { return this.svc.updateStatus(id, status, req.user.userId); }
  @Delete(':id') remove(@Param('id') id: string, @Request() req: any)                           { return this.svc.remove(id, req.user.userId); }
}
