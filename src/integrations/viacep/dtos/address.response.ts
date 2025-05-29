import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ViacepAddressResponseDto {
  @ApiProperty({
    description: 'CEP do endereço (apenas números)',
    example: '01001000',
  })
  @IsString()
  cep: string;

  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apto 123',
    required: false,
  })
  @IsString()
  complement: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString()
  district: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Código IBGE',
    example: '3550308',
  })
  @IsString()
  ibge: string;

  @ApiProperty({
    description: 'Código GIA',
    example: '1004',
  })
  @IsString()
  gia: string;

  @ApiProperty({
    description: 'Código DDD',
    example: '11',
  })
  @IsString()
  areaCode: string;

  @ApiProperty({
    description: 'Código SIAFI',
    example: '7107',
  })
  @IsString()
  siafi: string;
}
