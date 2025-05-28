import { Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { IProducerRepository } from './producer.interface';
import { Producer } from '../../../../database/entities/producer.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IListProducersRequestDto } from '../../dtos/producer/list.request.dto';
import { IUpdateProducerRequestDto } from '../../dtos/producer/update.request.dto';

@Injectable()
export class ProducerRepository
  extends BaseRepository<Producer>
  implements IProducerRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Producer);
  }

  async update(
    id: string,
    data: IUpdateProducerRequestDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(id, data);
  }

  async findByFilters(
    filters: IListProducersRequestDto,
  ): Promise<[Producer[], number]> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'name',
      sortBy = 'ASC',
      search,
    } = filters;

    const queryBuilder = this.repository.createQueryBuilder('producer');

    if (search) {
      queryBuilder.where(
        '(producer.name LIKE :search OR producer.email LIKE :search OR producer.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`producer.${orderBy}`, sortBy)
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }
}
