import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

// Cast prisma to any once so all model properties resolve
const db = (p: PrismaService) => p as any;

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(dto: CreateBookingDto, providerId: string) {
    return db(this.prisma).$transaction(async (tx: any) => {
      const existing = await tx.booking.findFirst({
        where: { providerId, date: new Date(dto.date), status: { in: ['CONFIRMED', 'PREPARING'] } },
      });
      if (existing) throw new ConflictException(`Déjà réservé le ${dto.date}`);

      return tx.booking.create({
        data: {
          eventId: dto.eventId,
          providerId,
          serviceId: dto.serviceId ?? null,
          date: new Date(dto.date),
          totalMillimes: dto.totalMillimes,
          depositMillimes: dto.depositMillimes ?? 0,
          status: 'PENDING',
          reference: `FERHA-${Date.now()}`,
        },
      });
    });
  }

  async findAllForProvider(providerId: string) {
    return db(this.prisma).booking.findMany({
      where: { providerId },
      include: { event: { select: { title: true, date: true, governorate: true } }, service: { select: { name: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async confirmContract(bookingId: string, providerId: string) {
    return db(this.prisma).booking.update({
      where: { id: bookingId, providerId },
      data: { contractSigned: true, contractSignedAt: new Date(), status: 'CONFIRMED', confirmedAt: new Date() },
    });
  }

  async confirmDeposit(bookingId: string, providerId: string) {
    return db(this.prisma).booking.update({
      where: { id: bookingId, providerId },
      data: { depositReceived: true, depositReceivedAt: new Date() },
    });
  }

  async markFullyPaid(bookingId: string, providerId: string) {
    return db(this.prisma).booking.update({
      where: { id: bookingId, providerId },
      data: { fullyPaid: true, fullyPaidAt: new Date(), status: 'COMPLETED' },
    });
  }
}
