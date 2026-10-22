import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { CreateQuoteDto } from './dto/create-quote.dto';

const db = (p: PrismaService) => p as any;

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async createQuoteRequest(dto: CreateQuoteRequestDto, clientId: string) {
    const event = await db(this.prisma).event.findFirst({ where: { id: dto.eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');
    return db(this.prisma).quoteRequest.upsert({
      where: { eventId_providerId: { eventId: dto.eventId, providerId: dto.providerId } },
      create: { eventId: dto.eventId, providerId: dto.providerId, message: dto.message, guestCount: dto.guestCount, status: 'PENDING' },
      update:  { message: dto.message, guestCount: dto.guestCount, status: 'PENDING' },
    });
  }

  async getQuoteRequestsForEvent(eventId: string, clientId: string) {
    const event = await db(this.prisma).event.findFirst({ where: { id: eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');
    return db(this.prisma).quoteRequest.findMany({
      where: { eventId },
      include: { provider: { select: { businessName: true, slug: true, rating: true } }, quotes: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getIncomingRequests(providerId: string) {
    return db(this.prisma).quoteRequest.findMany({
      where: { providerId, status: 'PENDING' },
      include: { event: { select: { title: true, date: true, governorate: true, guestCount: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createQuote(dto: CreateQuoteDto, providerId: string) {
    const request = await db(this.prisma).quoteRequest.findFirst({ where: { id: dto.requestId, providerId } });
    if (!request) throw new NotFoundException('Quote request not found');
    const totalMillimes = dto.items.reduce((sum: number, item: any) => sum + item.quantity * item.unitMillimes, 0);
    const quote = await db(this.prisma).quote.create({
      data: {
        requestId: dto.requestId, providerId, totalMillimes,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        notes: dto.notes, status: 'SENT',
        items: { create: dto.items.map((item: any) => ({ serviceId: item.serviceId ?? null, label: item.label, quantity: item.quantity, unitMillimes: item.unitMillimes, totalMillimes: item.quantity * item.unitMillimes })) },
      },
      include: { items: true },
    });
    await db(this.prisma).quoteRequest.update({ where: { id: dto.requestId }, data: { status: 'QUOTED' } });
    return quote;
  }

  async acceptQuote(quoteId: string, clientId: string) {
    const quote = await db(this.prisma).quote.findFirst({ where: { id: quoteId }, include: { request: { include: { event: true } } } });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.request.event.clientId !== clientId) throw new ForbiddenException();
    await db(this.prisma).quote.update({ where: { id: quoteId }, data: { status: 'ACCEPTED' } });
    await db(this.prisma).quoteRequest.update({ where: { id: quote.requestId }, data: { status: 'ACCEPTED' } });
    return { message: 'Quote accepted. Arrange the contract face-to-face.' };
  }

  async rejectQuote(quoteId: string, clientId: string) {
    const quote = await db(this.prisma).quote.findFirst({ where: { id: quoteId }, include: { request: { include: { event: true } } } });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.request.event.clientId !== clientId) throw new ForbiddenException();
    return db(this.prisma).quote.update({ where: { id: quoteId }, data: { status: 'REJECTED' } });
  }
}
