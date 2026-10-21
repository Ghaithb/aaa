import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class BookingsModule {}
