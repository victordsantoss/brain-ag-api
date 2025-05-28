import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';

export class PaginationMeta {
  @ApiProperty({
    description: 'Limite de registros por página',
    example: 100,
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Número da página atual',
    example: 10,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Número total de registros',
    example: 1,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
  })
  @IsNumber()
  totalPages: number;
}

export class BasePaginationResponseDto<T> {
  @ApiProperty({
    description: 'Lista de itens da página atual',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  data: T[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMeta,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationMeta)
  meta: PaginationMeta;
}
