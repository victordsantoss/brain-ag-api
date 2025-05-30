import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IListTopFarmProducerResponseDto {
  @ApiProperty({
    description: 'Nome do produtor',
    example: 'João Silva',
  })
  @IsString()
  name: string;
}

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
    description: 'Produção total da fazenda em toneladas',
    example: 15000.25,
  })
  @IsNumber()
  totalProduction: number;

  @ApiProperty({
    description: 'Produtor da fazenda',
    type: IListTopFarmProducerResponseDto,
  })
  @ValidateNested()
  @Type(() => IListTopFarmProducerResponseDto)
  producer: IListTopFarmProducerResponseDto;
}
