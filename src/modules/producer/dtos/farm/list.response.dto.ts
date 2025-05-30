import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsDate,
  IsUUID,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import { BasePaginationResponseDto } from '../../../../common/dtos/base-pagination.response.dto';
import { IBaseProducerRequestDto } from '../producer/base.dto';

export class IFarmProducerResponseDto {
  @ApiProperty({
    description: 'Nome do produtor',
    example: 'João Silva',
  })
  @IsString()
  name: string;
}

export class IFarmAddressResponseDto {
  @ApiProperty({
    description: 'Rua',
    example: 'Rua das Flores',
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'Complemento',
    example: 'Apto 45',
  })
  @IsString()
  complement: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString()
  neighborhood: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
  })
  @IsString()
  zipCode: string;
}

export class IFarmsResponseDto extends PartialType(IBaseProducerRequestDto) {
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
    description: 'Área total da fazenda em hectares',
    example: 100.5,
  })
  @IsNumber()
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável em hectares',
    example: 80.5,
  })
  @IsNumber()
  cultivatedArea: number;

  @ApiProperty({
    description: 'Área de vegetação em hectares',
    example: 20.0,
  })
  @IsNumber()
  vegetationArea: number;

  @ApiProperty({
    description: 'Status da fazenda',
    enum: BaseEntityStatus,
    example: BaseEntityStatus.ACTIVE,
  })
  @IsEnum(BaseEntityStatus)
  status: BaseEntityStatus;

  @ApiProperty({
    description: 'Produtor da fazenda',
    type: IFarmProducerResponseDto,
  })
  @ValidateNested()
  @Type(() => IFarmProducerResponseDto)
  producer: IFarmProducerResponseDto;

  @ApiProperty({
    description: 'Endereço da fazenda',
    type: IFarmAddressResponseDto,
  })
  @ValidateNested()
  @Type(() => IFarmAddressResponseDto)
  address: IFarmAddressResponseDto;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-03-20T10:00:00Z',
  })
  @IsDate()
  createdAt: Date;
}

export class IListFarmsResponseDto extends BasePaginationResponseDto<IListFarmsResponseDto> {
  @ApiProperty({
    description: 'Lista de propriedades rurais',
    type: [IListFarmsResponseDto],
  })
  data: IListFarmsResponseDto[];
}
