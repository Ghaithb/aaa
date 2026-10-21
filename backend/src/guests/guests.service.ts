import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { RsvpStatus } from '@prisma/client';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  private async assertOwner(eventId: string, clientId: string) {
    const event = await this.prisma.event.findFirst({ where: { id: eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');
  }

  async findAll(eventId: string, clientId: string) {
    await this.assertOwner(eventId, clientId);
    const guests = await this.prisma.guest.findMany({ where: { eventId }, orderBy: { lastName: 'asc' } });
    const counts = {
      total: guests.length,
      confirmed: guests.filter((g) => g.rsvpStatus === 'CONFIRMED').length,
      declined: guests.filter((g) => g.rsvpStatus === 'DECLINED').length,
      pending: guests.filter((g) => g.rsvpStatus === 'PENDING').length,
    };
    return { guests, counts };
  }

  async create(eventId: string, dto: CreateGuestDto, clientId: string) {
    await this.assertOwner(eventId, clientId);
    return this.prisma.guest.create({ data: { eventId, ...dto } });
  }

  async bulkCreate(eventId: string, guests: CreateGuestDto[], clientId: string) {
    await this.assertOwner(eventId, clientId);
    return this.prisma.guest.createMany({
      data: guests.map((g) => ({ eventId, ...g })),
      skipDuplicates: true,
    });
  }

  async updateRsvp(id: string, rsvpStatus: RsvpStatus, clientId: string) {
    const guest = await this.prisma.guest.findUnique({ where: { id }, include: { event: true } });
    if (!guest || guest.event.clientId !== clientId) throw new ForbiddenException();
    return this.prisma.guest.update({ where: { id }, data: { rsvpStatus } });
  }

  async remove(id: string, clientId: string) {
    const guest = await this.prisma.guest.findUnique({ where: { id }, include: { event: true } });
    if (!guest || guest.event.clientId !== clientId) throw new ForbiddenException();
    return this.prisma.guest.delete({ where: { id } });
  }
}
