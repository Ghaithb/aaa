import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventsModule } from './events/events.module';
import { QuotesModule } from './quotes/quotes.module';
import { BudgetModule } from './budget/budget.module';
import { TasksModule } from './tasks/tasks.module';
import { GuestsModule } from './guests/guests.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EventsModule,
    BookingsModule,
    QuotesModule,
    BudgetModule,
    TasksModule,
    GuestsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
