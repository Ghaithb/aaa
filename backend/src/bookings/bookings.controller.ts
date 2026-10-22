import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.PRESTATAIRE)
  async create(@Body() dto: CreateBookingDto, @Request() req: any) {
    try {
      return await this.bookingsService.createBooking(dto, req.user.userId);
    } catch (e: any) {
      throw e;
    }
  }

  @Get()
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  findAll(@Request() req: any) {
    return this.bookingsService.findAllForProvider(req.user.userId);
  }

  @Patch(':id/contract')
  @Roles(UserRole.PRESTATAIRE)
  confirmContract(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.confirmContract(id, req.user.userId);
  }

  @Patch(':id/deposit')
  @Roles(UserRole.PRESTATAIRE)
  confirmDeposit(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.confirmDeposit(id, req.user.userId);
  }

  @Patch(':id/paid')
  @Roles(UserRole.PRESTATAIRE)
  markFullyPaid(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.markFullyPaid(id, req.user.userId);
  }
}
