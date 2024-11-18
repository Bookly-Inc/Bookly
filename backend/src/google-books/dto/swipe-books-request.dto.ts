import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SwipeBooksRequestDto {
  @ApiProperty({
    description: 'Number of books to return',
    minimum: 1,
    maximum: 40,
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  @Type(() => Number)
  limit?: number;
}
