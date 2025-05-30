import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class IListTopHarvestRequestDto {
  @ApiProperty({
    description: 'Ano para filtrar as safras',
    example: 2024,
    required: false,
  })
  @IsNumber()
  @Min(1900)
  @IsOptional()
  year: number;

  @ApiProperty({
    description: 'Nome da cultura para filtrar as safras',
    example: 'Soja',
    required: false,
  })
  @IsString()
  @IsOptional()
  cultureName?: string;

  @ApiProperty({
    description: 'Estado para filtrar as safras',
    example: 'SP',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 2, { message: 'O estado deve ter exatamente 2 caracteres' })
  state?: string;
}
