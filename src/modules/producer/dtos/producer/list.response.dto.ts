import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDate, IsUUID } from 'class-validator';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import { IBaseProducerRequestDto } from './base.dto';
import { BasePaginationResponseDto } from '../../../../common/dtos/base-pagination.response.dto';

export class IProducersResponseDto extends IBaseProducerRequestDto {
  @ApiProperty({
    description: 'ID único do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

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
}

export class IListProducersResponseDto extends BasePaginationResponseDto<IProducersResponseDto> {
  @ApiProperty({
    description: 'Lista de produtores',
    type: [IProducersResponseDto],
  })
  data: IProducersResponseDto[];
}
