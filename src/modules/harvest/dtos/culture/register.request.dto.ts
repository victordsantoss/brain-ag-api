import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IBaseCultureRequestDto } from './base.dto';

export class IRegisterCultureRequestDto extends IBaseCultureRequestDto {
  @ApiProperty({
    description: 'ID da propriedade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  farmId: string;
}
