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
      .select('farm')
      .addSelect('producer')
      .addSelect('harvest')
      .addSelect('address');

    if (filters?.state) {
      queryBuilder.andWhere('address.state = :state', { state: filters.state });
    }

    return queryBuilder
      .orderBy('harvest.actualProduction', 'DESC')
      .take(3)
      .getMany();
  }
}
