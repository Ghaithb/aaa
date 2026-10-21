import { Controller, Get, Post, Body, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly svc: MessagesService) {}

  @Post()
  send(
    @Body() body: { providerId: string; content: string; eventId?: string },
    @Request() req,
  ) {
    return this.svc.sendMessage(req.user.userId, body.providerId, body.content, body.eventId);
  }

  @Get(':providerId')
  getConversation(@Param('providerId') providerId: string, @Request() req) {
    return this.svc.getConversation(req.user.userId, providerId);
  }

  @Patch(':providerId/read')
  markRead(@Param('providerId') providerId: string, @Request() req) {
    return this.svc.markRead(providerId, req.user.userId);
  }
}
