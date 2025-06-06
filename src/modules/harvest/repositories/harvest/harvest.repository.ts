import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Harvest } from '../../../../database/entities/harvest.entity';
import { IHarvestRepository } from './harvest.interface';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IListTopHarvestRequestDto } from '../../dtos/harvest/list-top-harvest.request.dto';

@Injectable()
export class HarvestRepository
  extends BaseRepository<Harvest>
  implements IHarvestRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Harvest);
  }

  async findTotalAreaUsedByFarmId(farmId: string): Promise<number> {
    const harvests = await this.repository.find({
      where: { farm: { id: farmId } },
    });
    return harvests.reduce((sum, harvest) => sum + Number(harvest.area), 0);
  }

  async findTopHarvestsByYear(
    filters: IListTopHarvestRequestDto,
  ): Promise<Harvest[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('harvest')
      .leftJoinAndSelect('harvest.culture', 'culture')
      .leftJoinAndSelect('harvest.farm', 'farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .leftJoinAndSelect('farm.address', 'address')
      .andWhere('harvest.actualProduction IS NOT NULL')
      .orderBy('harvest.actualProduction', 'DESC')
      .take(3);

    if (filters.year) {
      queryBuilder.andWhere('harvest.year = :year', { year: filters.year });
    }

    if (filters.cultureName) {
      queryBuilder.andWhere('LOWER(culture.name) = LOWER(:cultureName)', {
        cultureName: filters.cultureName,
      });
    }

    if (filters.state) {
      queryBuilder.andWhere('LOWER(address.state) = LOWER(:state)', {
        state: filters.state,
      });
    }

    return queryBuilder.getMany();
  }
}
