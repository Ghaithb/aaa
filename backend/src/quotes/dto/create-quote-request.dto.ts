import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuoteRequestDto {
  @IsString()
  eventId: string;

  @IsString()
  providerId: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsInt()
  @IsOptional()
  guestCount?: number;
}
