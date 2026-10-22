import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { QuotesService } from './quotes.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotesController {
  constructor(private readonly svc: QuotesService) {}

  @Post('quote-requests')   @Roles(UserRole.CLIENT)      createRequest(@Body() dto: CreateQuoteRequestDto, @Request() req: any) { return this.svc.createQuoteRequest(dto, req.user.userId); }
  @Get('events/:eventId/quote-requests') @Roles(UserRole.CLIENT) getForEvent(@Param('eventId') eventId: string, @Request() req: any) { return this.svc.getQuoteRequestsForEvent(eventId, req.user.userId); }
  @Get('quote-requests/incoming') @Roles(UserRole.PRESTATAIRE)   incoming(@Request() req: any) { return this.svc.getIncomingRequests(req.user.userId); }
  @Post('quotes')           @Roles(UserRole.PRESTATAIRE) createQuote(@Body() dto: CreateQuoteDto, @Request() req: any) { return this.svc.createQuote(dto, req.user.userId); }
  @Patch('quotes/:id/accept') @Roles(UserRole.CLIENT)    accept(@Param('id') id: string, @Request() req: any) { return this.svc.acceptQuote(id, req.user.userId); }
  @Patch('quotes/:id/reject') @Roles(UserRole.CLIENT)    reject(@Param('id') id: string, @Request() req: any) { return this.svc.rejectQuote(id, req.user.userId); }
}
