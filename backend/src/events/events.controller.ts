import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Post()   create(@Body() dto: CreateEventDto, @Request() req: any)                          { return this.svc.create(dto, req.user.userId); }
  @Get()    findAll(@Request() req: any)                                                       { return this.svc.findAll(req.user.userId); }
  @Get(':id') findOne(@Param('id') id: string, @Request() req: any)                           { return this.svc.findOne(id, req.user.userId); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Request() req: any) { return this.svc.update(id, dto, req.user.userId); }
  @Delete(':id') remove(@Param('id') id: string, @Request() req: any)                         { return this.svc.remove(id, req.user.userId); }
}
