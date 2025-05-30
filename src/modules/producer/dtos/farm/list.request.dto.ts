import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationRequestDto } from '../../../../common/dtos/base-pagination.request.dto';
import { Transform } from 'class-transformer';

export class IListFarmsRequestDto extends BasePaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Nome da propriedade rural ou nome do produtor',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  search?: string;
}
