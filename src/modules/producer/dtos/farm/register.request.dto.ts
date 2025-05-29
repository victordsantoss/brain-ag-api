import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

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
  arableArea: number;

  @ApiProperty({
    description: 'Área de vegetação em hectares',
    example: 20.0,
  })
  @IsNotEmpty({ message: 'A área de vegetação é obrigatória' })
  @IsNumber({}, { message: 'A área de vegetação deve ser um número' })
  @Min(0, { message: 'A área de vegetação deve ser maior ou igual a zero' })
  vegetationArea: number;
}
