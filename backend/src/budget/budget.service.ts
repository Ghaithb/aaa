import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  private async assertOwner(eventId: string, clientId: string) {
    const event = await this.prisma.event.findFirst({ where: { id: eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');
    return event;
  }

  async findAll(eventId: string, clientId: string) {
    await this.assertOwner(eventId, clientId);
    const lines = await this.prisma.budgetLine.findMany({ where: { eventId }, orderBy: { category: 'asc' } });
    const total = lines.reduce((s, l) => s + l.estimatedMillimes, 0);
    const spent = lines.reduce((s, l) => s + l.actualMillimes, 0);
    return { lines, totalEstimatedMillimes: total, totalActualMillimes: spent };
  }

  async create(eventId: string, dto: CreateBudgetLineDto, clientId: string) {
    await this.assertOwner(eventId, clientId);
    return this.prisma.budgetLine.create({ data: { eventId, ...dto } });
  }

  async update(id: string, dto: Partial<CreateBudgetLineDto>, clientId: string) {
    const line = await this.prisma.budgetLine.findUnique({ where: { id }, include: { event: true } });
    if (!line || line.event.clientId !== clientId) throw new ForbiddenException();
    return this.prisma.budgetLine.update({ where: { id }, data: dto });
  }

  async remove(id: string, clientId: string) {
    const line = await this.prisma.budgetLine.findUnique({ where: { id }, include: { event: true } });
    if (!line || line.event.clientId !== clientId) throw new ForbiddenException();
    return this.prisma.budgetLine.delete({ where: { id } });
  }
}
