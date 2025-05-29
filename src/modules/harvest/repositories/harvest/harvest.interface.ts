import { Harvest } from 'src/database/entities/harvest.entity';
import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';

export interface IHarvestRepository extends IBaseRepository<Harvest> {
  findTotalAreaUsedByFarmId(farmId: string): Promise<number>;
}
