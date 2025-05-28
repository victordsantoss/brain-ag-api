import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IRegisterProducerRequestDto } from '../../dtos/producer/register.request.dto';
import { IRegisterProducerService } from '../../services/producer/register/register.interface';
import { Producer } from '../../../../database/entities/producer.entity';
import { CpfGuard } from '../../../../common/guards/cpf.guard';

@Controller('producer')
export class ProducerController {
  constructor(
    @Inject('IRegisterProducerService')
    private readonly registerProducerService: IRegisterProducerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo produtor' })
  @ApiResponse({
    status: 201,
    description: 'Produtor registrado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiBody({
    type: IRegisterProducerRequestDto,
    description: 'Dados de registro do produtor',
  })
  @UseGuards(CpfGuard)
  async create(
    @Body() producerData: IRegisterProducerRequestDto,
  ): Promise<Producer> {
    return await this.registerProducerService.perform(producerData);
  }
}
