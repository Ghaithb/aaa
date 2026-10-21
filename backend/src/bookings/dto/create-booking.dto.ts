import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  eventId: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsDateString()
  date: string; // ISO date e.g. "2024-06-15"

  @IsInt()
  totalMillimes: number;

  @IsInt()
  @IsOptional()
  depositMillimes?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
