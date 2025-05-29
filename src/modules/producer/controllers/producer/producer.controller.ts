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

@ApiTags('Produtor')
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

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produtor existente' })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
    type: UpdateResult,
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
    type: UpdateResult,
  })
  async delete(@Param('id') id: string): Promise<UpdateResult> {
    return this.deleteProducerService.perform(id);
  }
}
