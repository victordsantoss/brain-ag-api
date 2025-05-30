import { Controller, Post, Body, Inject, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Farm } from '../../../../database/entities/farm.entity';
import { IRegisterFarmRequestDto } from '../../dtos/farm/register.request.dto';
import { IRegisterFarmService } from '../../services/farm/register/register.interface';
import { IListTopFarmsService } from '../../services/farm/list-top-farms/list-top-farms.interface';
import { IListTopFarmResponseDto } from '../../dtos/farm/list-top-farms.response.dto';
import { IListTopFarmsRequestDto } from '../../dtos/farm/list-top-farms.request.dto';

@ApiTags('Produtor e Propriedade Rural')
@Controller('farm')
export class FarmController {
  constructor(
    @Inject('IRegisterFarmService')
    private readonly registerFarmService: IRegisterFarmService,

    @Inject('IListTopFarmsService')
    private readonly listTopFarmsService: IListTopFarmsService,
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

  @Get('top')
  @ApiOperation({
    summary:
      'Listar as 3 maiores fazendas com base na produção real, por ano, cultura ou estado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista das 3 maiores fazendas retornada com sucesso.',
    type: [IListTopFarmResponseDto],
  })
  async listTopFarms(
    @Query() filters?: IListTopFarmsRequestDto,
  ): Promise<IListTopFarmResponseDto[]> {
    return await this.listTopFarmsService.perform(filters);
  }
}
