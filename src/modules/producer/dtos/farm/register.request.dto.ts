import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  MaxLength,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  @IsNotEmpty({ message: 'O nome da rua é obrigatório' })
  @IsString({ message: 'O nome da rua deve ser uma string' })
  @MaxLength(200, {
    message: 'O nome da rua deve ter no máximo 200 caracteres',
  })
  street: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  @IsNotEmpty({ message: 'O número é obrigatório' })
  @IsString({ message: 'O número deve ser uma string' })
  @MaxLength(10, {
    message: 'O número deve ter no máximo 10 caracteres',
  })
  number: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apto 123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string' })
  @MaxLength(100, {
    message: 'O complemento deve ter no máximo 100 caracteres',
  })
  complement?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  @IsString({ message: 'O bairro deve ser uma string' })
  @MaxLength(100, {
    message: 'O bairro deve ter no máximo 100 caracteres',
  })
  neighborhood: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @IsString({ message: 'A cidade deve ser uma string' })
  @MaxLength(100, {
    message: 'A cidade deve ter no máximo 100 caracteres',
  })
  city: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
  })
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @IsString({ message: 'O estado deve ser uma string' })
  @MaxLength(2, {
    message: 'O estado deve ter 2 caracteres',
  })
  state: string;

  @ApiProperty({
    description: 'CEP (apenas números)',
    example: '01001000',
  })
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @IsString({ message: 'O CEP deve ser uma string' })
  @MaxLength(8, {
    message: 'O CEP deve ter 8 caracteres',
  })
  zipCode: string;
}

export class IRegisterFarmRequestDto {
  @ApiProperty({
    description: 'ID do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'O ID do produtor é obrigatório' })
  @IsString({ message: 'O ID do produtor deve ser uma string' })
  producerId: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
  })
  @IsNotEmpty({ message: 'O nome da fazenda é obrigatório' })
  @IsString({ message: 'O nome da fazenda deve ser uma string' })
  @MaxLength(100, {
    message: 'O nome da fazenda deve ter no máximo 100 caracteres',
  })
  name: string;

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 100.5,
  })
  @IsNotEmpty({ message: 'A área total é obrigatória' })
  @IsNumber({}, { message: 'A área total deve ser um número' })
  @Min(0, { message: 'A área total deve ser maior ou igual a zero' })
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável em hectares',
    example: 80.5,
  })
  @IsNotEmpty({ message: 'A área agricultável é obrigatória' })
  @IsNumber({}, { message: 'A área agricultável deve ser um número' })
  @Min(0, { message: 'A área agricultável deve ser maior ou igual a zero' })
  cultivatedArea: number;

  @ApiProperty({
    description: 'Área de vegetação em hectares',
    example: 20.0,
  })
  @IsNotEmpty({ message: 'A área de vegetação é obrigatória' })
  @IsNumber({}, { message: 'A área de vegetação deve ser um número' })
  @Min(0, { message: 'A área de vegetação deve ser maior ou igual a zero' })
  vegetationArea: number;

  @ApiProperty({
    description: 'Endereço da fazenda',
    type: AddressDto,
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
