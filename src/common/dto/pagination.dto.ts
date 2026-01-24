import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTo {
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  take?: number;
}
