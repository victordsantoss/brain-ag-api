import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationRequestDto } from '../../../../common/dtos/base-pagination.request.dto';
import { Transform } from 'class-transformer';

export class IListProducersRequestDto extends BasePaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Nome, email ou telefone do produtor',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  search?: string;
}
