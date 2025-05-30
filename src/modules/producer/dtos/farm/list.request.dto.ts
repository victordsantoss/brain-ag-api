import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { BasePaginationRequestDto } from '../../../../common/dtos/base-pagination.request.dto';
import { Transform } from 'class-transformer';

export class IListFarmsRequestDto extends BasePaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Nome da propriedade rural',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  search?: string;

  @ApiPropertyOptional({
    description: 'ID do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => value ?? undefined)
  producerId?: string;

  @ApiPropertyOptional({
    description: 'Estado da propriedade rural',
    example: 'SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'O estado deve ter exatamente 2 caracteres' })
  @Transform(({ value }) => value ?? undefined)
  state?: string;

  @ApiPropertyOptional({
    description: 'Nome da cultura plantada',
    example: 'Soja',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
  cultureName?: string;
}
