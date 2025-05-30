import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class IListTopHarvestRequestDto {
  @ApiProperty({
    description: 'Ano para filtrar as safras',
    example: 2024,
  })
  @IsNumber()
  @Min(1900)
  year: number;
}
