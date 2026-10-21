import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RsvpStatus } from '@prisma/client';

export class CreateGuestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  group?: string;

  @IsEnum(RsvpStatus)
  @IsOptional()
  rsvpStatus?: RsvpStatus;

  @IsBoolean()
  @IsOptional()
  plusOne?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
