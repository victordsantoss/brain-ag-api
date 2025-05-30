import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BasePaginationResponseDto } from '../../../../../common/dtos/base-pagination.response.dto';
import { Producer } from '../../../../../database/entities/producer.entity';
import { IListProducersRequestDto } from '../../../dtos/producer/list.request.dto';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { IProducersResponseDto } from '../../../dtos/producer/list.response.dto';

@Injectable()
export class ListProducersService {
  private readonly logger = new Logger(ListProducersService.name);

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(
    query: IListProducersRequestDto,
  ): Promise<BasePaginationResponseDto<IProducersResponseDto>> {
    this.logger.log('Iniciando método perform');

    try {
      const {
        page = 1,
        limit = 10,
        orderBy = 'name',
        sortBy = 'ASC',
        search,
      } = query;

      const [producers, total] = await this.producerRepository.findByFilters({
        page,
        limit,
        orderBy,
        sortBy,
        search,
      });

      return {
        data: producers.map(this.mapToResponse),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao buscar produtores`)
      );
    }
  }

  private mapToResponse(producer: Producer): IProducersResponseDto {
    this.logger.log('Mapeando resposta para o cliente');
    return {
      id: producer.id,
      name: producer.name,
      email: producer.email,
      cpf: producer.cpf,
      phone: producer.phone,
      status: producer.status,
      createdAt: producer.createdAt,
    };
  }
}
