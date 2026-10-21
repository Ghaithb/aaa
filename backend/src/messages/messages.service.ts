import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, providerId: string, content: string, eventId?: string) {
    return this.prisma.message.create({
      data: { senderId, providerId, content, eventId: eventId ?? null },
    });
  }

  async getConversation(senderId: string, providerId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId, providerId },
          { senderId: providerId, providerId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markRead(providerId: string, senderId: string) {
    return this.prisma.message.updateMany({
      where: { senderId, providerId, isRead: false },
      data: { isRead: true },
    });
  }
}
