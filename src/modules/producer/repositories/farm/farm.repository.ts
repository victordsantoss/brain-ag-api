import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Farm } from '../../../../database/entities/farm.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IFarmRepository } from './farm.interface';
import { IListTopFarmsRequestDto } from '../../dtos/farm/list-top-farms.request.dto';

@Injectable()
export class FarmRepository
  extends BaseRepository<Farm>
  implements IFarmRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Farm);
  }

  async findTopFarmsByProduction(
    filters?: IListTopFarmsRequestDto,
  ): Promise<Farm[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .leftJoinAndSelect('farm.harvests', 'harvest')
      .leftJoinAndSelect('farm.address', 'address')
      .leftJoinAndSelect('harvest.culture', 'culture')
      .select('farm')
      .addSelect('producer')
      .addSelect('harvest')
      .addSelect('address')
      .addSelect('culture');

    if (filters?.state) {
      queryBuilder.andWhere('LOWER(address.state) = LOWER(:state)', {
        state: filters.state,
      });
    }

    if (filters?.year) {
      queryBuilder.andWhere('harvest.year = :year', { year: filters.year });
    }

    if (filters?.cultureName) {
      queryBuilder.andWhere('LOWER(culture.name) = LOWER(:cultureName)', {
        cultureName: filters.cultureName,
      });
    }

    return queryBuilder
      .orderBy('harvest.actualProduction', 'DESC')
      .take(3)
      .getMany();
  }
}
