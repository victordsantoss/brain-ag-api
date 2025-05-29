import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { IRegisterProducerRequestDto } from '../../dtos/producer/register.request.dto';
import { IRegisterProducerService } from '../../services/producer/register/register.interface';
import { Producer } from '../../../../database/entities/producer.entity';
import { CpfGuard } from '../../../../common/guards/cpf.guard';
import { BasePaginationResponseDto } from '../../../../common/dtos/base-pagination.response.dto';
import { IListProducersRequestDto } from '../../dtos/producer/list.request.dto';
import { IListProducersService } from '../../services/producer/list/list.interface';
import { IUpdateProducerService } from '../../services/producer/update/update.interface';
import { IUpdateProducerRequestDto } from '../../dtos/producer/update.request.dto';
import { UpdateResult } from 'typeorm';
import { IDeleteProducerService } from '../../services/producer/delete/delete.interface';
import {
  IProducersResponseDto,
  IListProducersResponseDto,
} from '../../dtos/producer/list.response.dto';
import { IGetProducerService } from '../../services/producer/get/get.interface';
import { IGetProducerResponseDto } from '../../dtos/producer/get.response.dto';

@ApiTags('Produtor e Propriedade Rural')
@Controller('producer')
export class ProducerController {
  constructor(
    @Inject('IRegisterProducerService')
    private readonly registerProducerService: IRegisterProducerService,

    @Inject('IListProducersService')
    private readonly listProducersService: IListProducersService,

    @Inject('IUpdateProducerService')
    private readonly updateProducerService: IUpdateProducerService,

    @Inject('IDeleteProducerService')
    private readonly deleteProducerService: IDeleteProducerService,

    @Inject('IGetProducerService')
    private readonly getProducerService: IGetProducerService,
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

  @Get()
  @ApiOperation({
    summary: 'Listar produtores de maneira paginada e filtrável',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso.',
    type: IListProducersResponseDto,
  })
  async list(
    @Query() query: IListProducersRequestDto,
  ): Promise<BasePaginationResponseDto<IProducersResponseDto>> {
    return await this.listProducersService.perform(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um produtor' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produtor retornados com sucesso.',
    type: IGetProducerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado.',
  })
  async get(@Param('id') id: string): Promise<IGetProducerResponseDto> {
    return await this.getProducerService.perform(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produtor existente' })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() data: IUpdateProducerRequestDto,
  ): Promise<UpdateResult> {
    return this.updateProducerService.perform(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um produtor logicamente' })
  @ApiResponse({
    status: 200,
    description: 'Produtor deletado com sucesso',
  })
  async delete(@Param('id') id: string): Promise<UpdateResult> {
    return this.deleteProducerService.perform(id);
  }
}
