import { Inject, Injectable, Logger } from '@nestjs/common';
import { BasePaginationResponseDto } from '../../../../../common/dtos/base-pagination.response.dto';
import { Producer } from '../../../../../database/entities/producer.entity';
import { IListProducersRequestDto } from '../../../dtos/producer/list.request.dto';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';

@Injectable()
export class ListProducersService {
  private readonly logger = new Logger(ListProducersService.name);

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(
    query: IListProducersRequestDto,
  ): Promise<BasePaginationResponseDto<Producer>> {
    this.logger.log('Iniciando método perform');
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
      data: producers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
