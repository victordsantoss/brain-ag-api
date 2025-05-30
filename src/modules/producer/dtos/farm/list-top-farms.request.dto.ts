import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class IListTopFarmsRequestDto {
  @ApiProperty({
    description: 'Estado para filtrar as fazendas',
    example: 'SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'O estado deve ter exatamente 2 caracteres' })
  state?: string;

  @ApiProperty({
    description: 'Nome da cultura para filtrar as fazendas',
    example: 'Soja',
    required: false,
  })
  @IsOptional()
  @IsString()
  cultureName?: string;

  @ApiProperty({
    description: 'Ano para filtrar as fazendas',
    example: 2024,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  year?: number;
}
