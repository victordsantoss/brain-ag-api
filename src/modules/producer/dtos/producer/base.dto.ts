import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, Matches } from 'class-validator';

export class IBaseProducerRequestDto {
  @ApiProperty({
    description: 'Nome completo do produtor rural',
    example: 'João da Silva',
  })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'CPF do produtor rural (apenas números)',
    example: '12345678900',
  })
  @IsString()
  @Length(11, 14)
  cpf: string;

  @ApiProperty({
    description: 'Email do produtor rural',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telefone de contato do produtor rural',
    example: '11999999999',
  })
  @IsString()
  @Length(10, 11)
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos numéricos',
  })
  phone: string;
}
