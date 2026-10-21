import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QuoteItemDto {
  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  label: string;

  @IsInt()
  quantity: number;

  @IsInt()
  unitMillimes: number;
}

export class CreateQuoteDto {
  @IsString()
  requestId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @IsString()
  @IsOptional()
  validUntil?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
