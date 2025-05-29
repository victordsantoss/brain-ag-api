import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { Harvest } from '../../../../database/entities/harvest.entity';
import { IRegisterHarvestRequestDto } from '../../dtos/harvest/register.request.dto';
import { IRegisterHarvestService } from '../../services/harvest/register/register.service.interface';

@ApiTags('Cultura e Safra')
@Controller('harvest')
export class HarvestController {
  constructor(
    @Inject('IRegisterHarvestService')
    private readonly registerHarvestService: IRegisterHarvestService,
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
}
