import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const db = (p: PrismaService) => p as any;

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  sendMessage(senderId: string, providerId: string, content: string, eventId?: string) {
    return db(this.prisma).message.create({ data: { senderId, providerId, content, eventId: eventId ?? null } });
  }

  getConversation(senderId: string, providerId: string) {
    return db(this.prisma).message.findMany({
      where: { OR: [{ senderId, providerId }, { senderId: providerId, providerId: senderId }] },
      orderBy: { createdAt: 'asc' },
    });
  }

  markRead(providerId: string, senderId: string) {
    return db(this.prisma).message.updateMany({
      where: { senderId, providerId, isRead: false },
      data: { isRead: true },
    });
  }
}
