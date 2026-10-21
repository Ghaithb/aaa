import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, RsvpStatus } from '@prisma/client';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@Controller('events/:eventId/guests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
export class GuestsController {
  constructor(private readonly svc: GuestsService) {}

  @Get()
  findAll(@Param('eventId') eventId: string, @Request() req) {
    return this.svc.findAll(eventId, req.user.userId);
  }

  @Post()
  create(@Param('eventId') eventId: string, @Body() dto: CreateGuestDto, @Request() req) {
    return this.svc.create(eventId, dto, req.user.userId);
  }

  @Post('bulk')
  bulkCreate(@Param('eventId') eventId: string, @Body() body: { guests: CreateGuestDto[] }, @Request() req) {
    return this.svc.bulkCreate(eventId, body.guests, req.user.userId);
  }

  @Patch(':id/rsvp')
  updateRsvp(@Param('id') id: string, @Body('rsvpStatus') rsvpStatus: RsvpStatus, @Request() req) {
    return this.svc.updateRsvp(id, rsvpStatus, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.svc.remove(id, req.user.userId);
  }
}
