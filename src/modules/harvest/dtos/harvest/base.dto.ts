import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { HarvestSeason } from '../../../../common/enums/harvest-season.enum';

export class IBaseHarvestRequestDto {
  @ApiProperty({
    description: 'Ano da safra',
    example: 2024,
  })
  @IsNumber()
  @Min(1900)
  year: number;

  @ApiProperty({
    description: 'Estação da safra',
    enum: HarvestSeason,
    example: HarvestSeason.VERAO,
  })
  @IsEnum(HarvestSeason)
  season: HarvestSeason;

  @ApiProperty({
    description: 'Área plantada em hectares',
    example: 100.5,
  })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({
    description: 'Produção esperada em toneladas',
    example: 5000.75,
  })
  @IsNumber()
  @Min(0)
  expectedProduction: number;

  @ApiProperty({
    description: 'Produção real em toneladas',
    example: 4800.25,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualProduction?: number;

  @ApiProperty({
    description: 'ID da fazenda',
    example: '700b8c28-b222-4656-9be7-5627bf78df9d',
  })
  @IsUUID()
  farmId: string;

  @ApiProperty({
    description: 'ID da cultura',
    example: '54dc88e7-b44d-4a3f-a69f-f059223f280d',
  })
  @IsUUID()
  cultureId: string;
}
