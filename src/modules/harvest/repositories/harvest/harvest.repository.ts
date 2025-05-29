import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Harvest } from 'src/database/entities/harvest.entity';
import { IHarvestRepository } from './harvest.interface';
import { BaseRepository } from 'src/common/repositories/base.repository';

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
}
