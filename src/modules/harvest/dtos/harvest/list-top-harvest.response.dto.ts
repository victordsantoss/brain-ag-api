import { ApiProperty } from '@nestjs/swagger';

export class IListTopHarvestResponseDto {
  @ApiProperty({
    description: 'ID da cultura',
    example: '54dc88e7-b44d-4a3f-a69f-f059223f280d',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soja',
  })
  name: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda 1',
  })
  farmName: string;

  @ApiProperty({
    description: 'Nome do produtor',
    example: 'Produtor 1',
  })
  producerName: string;

  @ApiProperty({
    description: 'Produção total real em toneladas',
    example: 15000.75,
  })
  totalProduction: number;

  @ApiProperty({
    description: 'Área total plantada em hectares',
    example: 300.5,
  })
  totalArea: number;
}
