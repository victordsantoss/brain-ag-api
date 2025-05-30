import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IProducerRepository } from './producer.interface';
import { Producer } from '../../../../database/entities/producer.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IListProducersRequestDto } from '../../dtos/producer/list.request.dto';

@Injectable()
export class ProducerRepository
  extends BaseRepository<Producer>
  implements IProducerRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Producer);
  }

  async findByIdWithFarms(id: string): Promise<Producer> {
    return this.repository.findOne({
      where: { id },
      relations: ['farms'],
    });
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

  async findTopProducersByProduction(): Promise<Producer[]> {
    return this.repository
      .createQueryBuilder('producer')
      .leftJoinAndSelect('producer.farms', 'farm')
      .leftJoinAndSelect('farm.harvests', 'harvest')
      .leftJoinAndSelect('farm.address', 'address')
      .leftJoinAndSelect('harvest.culture', 'culture')
      .select('producer')
      .addSelect('farm')
      .addSelect('harvest')
      .addSelect('address')
      .addSelect('culture')
      .orderBy('harvest.actualProduction', 'DESC')
      .take(3)
      .getMany();
  }
}
