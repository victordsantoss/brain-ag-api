import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Farm } from '../../../../database/entities/farm.entity';
import { IRegisterFarmRequestDto } from '../../dtos/farm/register.request.dto';
import { IRegisterFarmService } from '../../services/farm/register/register.interface';

@ApiTags('Produtor e Propriedade Rural')
@Controller('farm')
export class FarmController {
  constructor(
    @Inject('IRegisterFarmService')
    private readonly registerFarmService: IRegisterFarmService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar uma nova fazenda vinculada a um produtor',
  })
  @ApiResponse({
    status: 201,
    description: 'Fazenda criada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  async create(@Body() farmData: IRegisterFarmRequestDto): Promise<Farm> {
    return this.registerFarmService.perform(farmData);
  }
}
