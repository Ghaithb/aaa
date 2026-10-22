import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { BudgetService } from './budget.service';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';

@Controller('events/:eventId/budget')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
export class BudgetController {
  constructor(private readonly svc: BudgetService) {}
  @Get()     findAll(@Param('eventId') eventId: string, @Request() req: any)                           { return this.svc.findAll(eventId, req.user.userId); }
  @Post()    create(@Param('eventId') eventId: string, @Body() dto: CreateBudgetLineDto, @Request() req: any) { return this.svc.create(eventId, dto, req.user.userId); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateBudgetLineDto>, @Request() req: any) { return this.svc.update(id, dto, req.user.userId); }
  @Delete(':id') remove(@Param('id') id: string, @Request() req: any)                                  { return this.svc.remove(id, req.user.userId); }
}
