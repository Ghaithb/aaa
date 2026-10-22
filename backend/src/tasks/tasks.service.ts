import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

const db = (p: PrismaService) => p as any;

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async assertOwner(eventId: string, clientId: string) {
    const event = await db(this.prisma).event.findFirst({ where: { id: eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');
  }

  async findAll(eventId: string, clientId: string) {
    await this.assertOwner(eventId, clientId);
    return db(this.prisma).task.findMany({ where: { eventId }, orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }] });
  }

  async create(eventId: string, dto: CreateTaskDto, clientId: string) {
    await this.assertOwner(eventId, clientId);
    return db(this.prisma).task.create({
      data: { eventId, ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : null },
    });
  }

  async updateStatus(id: string, status: string, clientId: string) {
    const task = await db(this.prisma).task.findUnique({ where: { id }, include: { event: true } });
    if (!task || task.event.clientId !== clientId) throw new ForbiddenException();
    return db(this.prisma).task.update({ where: { id }, data: { status } });
  }

  async remove(id: string, clientId: string) {
    const task = await db(this.prisma).task.findUnique({ where: { id }, include: { event: true } });
    if (!task || task.event.clientId !== clientId) throw new ForbiddenException();
    return db(this.prisma).task.delete({ where: { id } });
  }
}
