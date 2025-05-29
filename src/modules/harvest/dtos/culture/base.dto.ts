import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class IBaseCultureRequestDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soja',
  })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada da cultura',
    example: 'Cultura de soja para produção de grãos',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
