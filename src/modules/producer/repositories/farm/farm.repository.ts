import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Farm } from '../../../../database/entities/farm.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IFarmRepository } from './farm.interface';

@Injectable()
export class FarmRepository
  extends BaseRepository<Farm>
  implements IFarmRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Farm);
  }

  async findTopFarmsByProduction(): Promise<Farm[]> {
    return this.repository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .leftJoinAndSelect('farm.harvests', 'harvest')
      .select('farm')
      .addSelect('producer')
      .addSelect('harvest')
      .orderBy('harvest.actualProduction', 'DESC')
      .take(3)
      .getMany();
  }
}
