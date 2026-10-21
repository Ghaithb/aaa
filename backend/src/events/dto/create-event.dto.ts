import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsEnum(EventType)
  type: EventType;

  @IsDateString()
  date: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  governorate: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsInt()
  @IsOptional()
  guestCount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  budgetMillimes?: number;
}
