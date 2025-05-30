import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsArray } from 'class-validator';

export class IListTopFarmResponseDto {
  @ApiProperty({
    description: 'ID da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Estado da fazenda',
    example: 'SP',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Produção total da fazenda em toneladas',
    example: 15000.25,
  })
  @IsNumber()
  totalProduction: number;

  @ApiProperty({
    description: 'Produtor da fazenda',
  })
  @IsString()
  producerName: string;

  @ApiProperty({
    description: 'Culturas da fazenda',
    example: ['Soja', 'Milho', 'Café'],
  })
  @IsArray()
  cultures: string[];
}
