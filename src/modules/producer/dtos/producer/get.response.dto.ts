import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDate } from 'class-validator';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import { IBaseProducerRequestDto } from './base.dto';

export class IGetProducerFarmResponseDto {
  @ApiProperty({
    description: 'ID da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
  })
  name: string;
}

export class IGetProducerResponseDto extends IBaseProducerRequestDto {
  @ApiProperty({
    description: 'Status do produtor',
    enum: BaseEntityStatus,
    example: BaseEntityStatus.ACTIVE,
  })
  @IsEnum(BaseEntityStatus)
  status: BaseEntityStatus;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-03-20T10:00:00Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Fazendas do produtor',
    type: [IGetProducerFarmResponseDto],
  })
  farms: IGetProducerFarmResponseDto[];
}
