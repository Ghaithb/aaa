import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';

const db = (p: PrismaService) => p as any;

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  private async assertOwner(eventId: string, clientId: string) {
    const event = await db(this.prisma).event.findFirst({ where: { id: eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');
  }

  async findAll(eventId: string, clientId: string) {
    await this.assertOwner(eventId, clientId);
    const guests = await db(this.prisma).guest.findMany({ where: { eventId }, orderBy: { lastName: 'asc' } });
    const counts = {
      total: guests.length,
      confirmed: guests.filter((g: any) => g.rsvpStatus === 'CONFIRMED').length,
      declined:  guests.filter((g: any) => g.rsvpStatus === 'DECLINED').length,
      pending:   guests.filter((g: any) => g.rsvpStatus === 'PENDING').length,
    };
    return { guests, counts };
  }

  async create(eventId: string, dto: CreateGuestDto, clientId: string) {
    await this.assertOwner(eventId, clientId);
    return db(this.prisma).guest.create({ data: { eventId, ...dto } });
  }

  async bulkCreate(eventId: string, guests: CreateGuestDto[], clientId: string) {
    await this.assertOwner(eventId, clientId);
    return db(this.prisma).guest.createMany({ data: guests.map((g) => ({ eventId, ...g })), skipDuplicates: true });
  }

  async updateRsvp(id: string, rsvpStatus: string, clientId: string) {
    const guest = await db(this.prisma).guest.findUnique({ where: { id }, include: { event: true } });
    if (!guest || guest.event.clientId !== clientId) throw new ForbiddenException();
    return db(this.prisma).guest.update({ where: { id }, data: { rsvpStatus } });
  }

  async remove(id: string, clientId: string) {
    const guest = await db(this.prisma).guest.findUnique({ where: { id }, include: { event: true } });
    if (!guest || guest.event.clientId !== clientId) throw new ForbiddenException();
    return db(this.prisma).guest.delete({ where: { id } });
  }
}
