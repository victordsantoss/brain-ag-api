import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { Culture } from '../../../../database/entities/culture.entity';
import { IRegisterCultureRequestDto } from '../../dtos/culture/register.request.dto';
import { IRegisterCultureService } from '../../services/culture/register/register.service.interface';

@ApiTags('Cultura e Safra')
@Controller('culture')
export class CultureController {
  constructor(
    @Inject('IRegisterCultureService')
    private readonly registerCultureService: IRegisterCultureService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar uma nova cultura vinculada a uma propriedade',
  })
  @ApiResponse({
    status: 201,
    description: 'Cultura registrada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiBody({
    type: IRegisterCultureRequestDto,
    description: 'Dados de registro da cultura',
  })
  async create(
    @Body() cultureData: IRegisterCultureRequestDto,
  ): Promise<Culture> {
    return await this.registerCultureService.perform(cultureData);
  }
}
