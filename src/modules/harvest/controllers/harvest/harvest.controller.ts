import { Body, Controller, Inject, Post, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { Harvest } from '../../../../database/entities/harvest.entity';
import { IRegisterHarvestRequestDto } from '../../dtos/harvest/register.request.dto';
import { IRegisterHarvestService } from '../../services/harvest/register/register.service.interface';
import { IListTopHarvestService } from '../../services/harvest/list-top-harvest/list-top-harvest.interface';
import { IListTopHarvestRequestDto } from '../../dtos/harvest/list-top-harvest.request.dto';
import { IListTopHarvestResponseDto } from '../../dtos/harvest/list-top-harvest.response.dto';

@ApiTags('Cultura e Safra')
@Controller('harvest')
export class HarvestController {
  constructor(
    @Inject('IRegisterHarvestService')
    private readonly registerHarvestService: IRegisterHarvestService,

    @Inject('IListTopHarvestService')
    private readonly listTopHarvestService: IListTopHarvestService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Registrar uma nova safra em uma propriedade vinculada a uma cultura',
  })
  @ApiResponse({
    status: 201,
    description: 'Safra registrada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiBody({
    type: IRegisterHarvestRequestDto,
    description: 'Dados de registro da safra',
  })
  async create(
    @Body() harvestData: IRegisterHarvestRequestDto,
  ): Promise<Harvest> {
    return await this.registerHarvestService.perform(harvestData);
  }

  @Get('top')
  @ApiOperation({
    summary: 'Listar as 3 maiores safras por produção real em um ano',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista das 3 maiores safras retornada com sucesso.',
    type: [IListTopHarvestResponseDto],
  })
  async listTopHarvests(
    @Query() filters: IListTopHarvestRequestDto,
  ): Promise<IListTopHarvestResponseDto[]> {
    return await this.listTopHarvestService.perform(filters);
  }
}
