import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBudgetLineDto {
  @IsString()
  category: string;

  @IsString()
  label: string;

  @IsInt()
  estimatedMillimes: number;

  @IsInt()
  @IsOptional()
  actualMillimes?: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
