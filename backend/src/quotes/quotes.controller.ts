import {
  Controller, Post, Get, Patch, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { QuotesService } from './quotes.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotesController {
  constructor(private readonly svc: QuotesService) {}

  // ── Client: send a quote request ──────────────────────────────────
  @Post('quote-requests')
  @Roles(UserRole.CLIENT)
  createRequest(@Body() dto: CreateQuoteRequestDto, @Request() req) {
    return this.svc.createQuoteRequest(dto, req.user.userId);
  }

  // ── Client: see all requests for an event ──────────────────────────
  @Get('events/:eventId/quote-requests')
  @Roles(UserRole.CLIENT)
  getForEvent(@Param('eventId') eventId: string, @Request() req) {
    return this.svc.getQuoteRequestsForEvent(eventId, req.user.userId);
  }

  // ── Provider: see incoming requests ───────────────────────────────
  @Get('quote-requests/incoming')
  @Roles(UserRole.PRESTATAIRE)
  incoming(@Request() req) {
    return this.svc.getIncomingRequests(req.user.userId);
  }

  // ── Provider: reply with a quote ──────────────────────────────────
  @Post('quotes')
  @Roles(UserRole.PRESTATAIRE)
  createQuote(@Body() dto: CreateQuoteDto, @Request() req) {
    return this.svc.createQuote(dto, req.user.userId);
  }

  // ── Client: accept a quote ────────────────────────────────────────
  @Patch('quotes/:id/accept')
  @Roles(UserRole.CLIENT)
  accept(@Param('id') id: string, @Request() req) {
    return this.svc.acceptQuote(id, req.user.userId);
  }

  // ── Client: reject a quote ────────────────────────────────────────
  @Patch('quotes/:id/reject')
  @Roles(UserRole.CLIENT)
  reject(@Param('id') id: string, @Request() req) {
    return this.svc.rejectQuote(id, req.user.userId);
  }
}
