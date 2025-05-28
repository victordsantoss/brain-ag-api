import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsEmail,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';

export class IUpdateProducerRequestDto {
  @ApiProperty({
    description: 'Nome completo do produtor rural',
    example: 'João da Silva',
  })
  @IsString()
  @IsOptional()
  @Length(3, 100)
  name?: string;

  @ApiProperty({
    description: 'CPF do produtor rural (apenas números)',
    example: '12345678900',
  })
  @IsString()
  @IsOptional()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'CPF deve conter exatamente 11 dígitos numéricos',
  })
  cpf?: string;

  @ApiProperty({
    description: 'Email do produtor rural',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone de contato do produtor rural',
    example: '11999999999',
  })
  @IsString()
  @IsOptional()
  @Length(10, 11)
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos numéricos',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Status do produtor rural',
    example: 'ATIVO',
  })
  @IsOptional()
  @IsEnum(BaseEntityStatus)
  status?: BaseEntityStatus;
}
