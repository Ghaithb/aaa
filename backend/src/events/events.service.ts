import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto, clientId: string) {
    return this.prisma.event.create({
      data: { ...dto, clientId, date: new Date(dto.date) },
    });
  }

  async findAll(clientId: string) {
    return this.prisma.event.findMany({
      where: { clientId, deletedAt: null },
      orderBy: { date: 'asc' },
      include: {
        _count: { select: { bookings: true, guests: true, tasks: true } },
      },
    });
  }

  async findOne(id: string, clientId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        bookings: { include: { provider: { select: { businessName: true } } } },
        budgetLines: true,
        tasks: { orderBy: { dueDate: 'asc' } },
        guests: true,
        quoteRequests: { include: { provider: { select: { businessName: true, rating: true } }, quotes: true } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.clientId !== clientId) throw new ForbiddenException();
    return event;
  }

  async update(id: string, dto: UpdateEventDto, clientId: string) {
    await this.findOne(id, clientId);
    return this.prisma.event.update({
      where: { id },
      data: { ...dto, ...(dto.date ? { date: new Date(dto.date) } : {}) },
    });
  }

  async remove(id: string, clientId: string) {
    await this.findOne(id, clientId);
    return this.prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
