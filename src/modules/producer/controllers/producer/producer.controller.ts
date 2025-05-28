import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IRegisterProducerRequestDto } from '../../dtos/producer/register.request.dto';
import { IRegisterProducerService } from '../../services/producer/register/register.interface';
import { Producer } from '../../../../database/entities/producer.entity';
import { CpfGuard } from '../../../../common/guards/cpf.guard';
import { BasePaginationResponseDto } from '../../../../common/dtos/base-pagination.response.dto';
import { IListProducersRequestDto } from '../../dtos/producer/list.request.dto';
import { IListProducersService } from '../../services/producer/list/list.interface';

@Controller('producer')
export class ProducerController {
  constructor(
    @Inject('IRegisterProducerService')
    private readonly registerProducerService: IRegisterProducerService,

    @Inject('IListProducersService')
    private readonly listProducersService: IListProducersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo produtor' })
  @ApiResponse({
    status: 201,
    description: 'Produtor registrado com sucesso.',
    type: Producer,
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

  @Get()
  @ApiOperation({
    summary: 'Listar produtores de maneira paginada e filtrável',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso.',
  })
  async list(
    @Query() query: IListProducersRequestDto,
  ): Promise<BasePaginationResponseDto<Producer>> {
    return await this.listProducersService.perform(query);
  }
}
