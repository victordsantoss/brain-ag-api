import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IListTopProducerFarmResponseDto {
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
    description: 'Culturas da fazenda',
    example: ['Soja', 'Milho', 'Café'],
  })
  @IsArray()
  cultures: string[];

  @ApiProperty({
    description: 'Produção total da fazenda em toneladas',
    example: 5000.75,
  })
  @IsNumber()
  production: number;
}

export class IListTopProducersResponseDto {
  @ApiProperty({
    description: 'ID do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nome do produtor',
    example: 'João Silva',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Produção total do produtor em toneladas',
    example: 15000.25,
  })
  @IsNumber()
  totalProduction: number;

  @ApiProperty({
    description: 'Lista de fazendas do produtor',
    type: [IListTopProducerFarmResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IListTopProducerFarmResponseDto)
  farms: IListTopProducerFarmResponseDto[];
}
