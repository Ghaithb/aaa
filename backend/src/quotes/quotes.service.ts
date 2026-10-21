import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  // ── CLIENT: send a quote request to a provider ─────────────────
  async createQuoteRequest(dto: CreateQuoteRequestDto, clientId: string) {
    // Verify event belongs to client
    const event = await this.prisma.event.findFirst({
      where: { id: dto.eventId, clientId },
    });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');

    return this.prisma.quoteRequest.upsert({
      where: { eventId_providerId: { eventId: dto.eventId, providerId: dto.providerId } },
      create: {
        eventId: dto.eventId,
        providerId: dto.providerId,
        message: dto.message,
        guestCount: dto.guestCount,
        status: 'PENDING',
      },
      update: {
        message: dto.message,
        guestCount: dto.guestCount,
        status: 'PENDING',
      },
    });
  }

  // ── CLIENT: list all quote requests for an event ────────────────
  async getQuoteRequestsForEvent(eventId: string, clientId: string) {
    const event = await this.prisma.event.findFirst({ where: { id: eventId, clientId } });
    if (!event) throw new ForbiddenException('Event not found or unauthorized');

    return this.prisma.quoteRequest.findMany({
      where: { eventId },
      include: {
        provider: { select: { businessName: true, slug: true, rating: true } },
        quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── PROVIDER: list incoming quote requests ──────────────────────
  async getIncomingRequests(providerId: string) {
    return this.prisma.quoteRequest.findMany({
      where: { providerId, status: 'PENDING' },
      include: {
        event: { select: { title: true, date: true, governorate: true, guestCount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── PROVIDER: respond with a quote ─────────────────────────────
  async createQuote(dto: CreateQuoteDto, providerId: string) {
    const request = await this.prisma.quoteRequest.findFirst({
      where: { id: dto.requestId, providerId },
    });
    if (!request) throw new NotFoundException('Quote request not found');

    const totalMillimes = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitMillimes,
      0,
    );

    const quote = await this.prisma.quote.create({
      data: {
        requestId: dto.requestId,
        providerId,
        totalMillimes,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        notes: dto.notes,
        status: 'SENT',
        items: {
          create: dto.items.map((item) => ({
            serviceId: item.serviceId ?? null,
            label: item.label,
            quantity: item.quantity,
            unitMillimes: item.unitMillimes,
            totalMillimes: item.quantity * item.unitMillimes,
          })),
        },
      },
      include: { items: true },
    });

    // Mark the request as QUOTED
    await this.prisma.quoteRequest.update({
      where: { id: dto.requestId },
      data: { status: 'QUOTED' },
    });

    return quote;
  }

  // ── CLIENT: accept a quote ──────────────────────────────────────
  async acceptQuote(quoteId: string, clientId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id: quoteId },
      include: { request: { include: { event: true } } },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.request.event.clientId !== clientId)
      throw new ForbiddenException('Not your event');

    await this.prisma.quote.update({ where: { id: quoteId }, data: { status: 'ACCEPTED' } });
    await this.prisma.quoteRequest.update({
      where: { id: quote.requestId },
      data: { status: 'ACCEPTED' },
    });
    return { message: 'Quote accepted. You can now arrange the contract face-to-face.' };
  }

  // ── CLIENT: reject a quote ──────────────────────────────────────
  async rejectQuote(quoteId: string, clientId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id: quoteId },
      include: { request: { include: { event: true } } },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.request.event.clientId !== clientId)
      throw new ForbiddenException('Not your event');

    return this.prisma.quote.update({ where: { id: quoteId }, data: { status: 'REJECTED' } });
  }
}
