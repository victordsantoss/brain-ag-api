import { Harvest } from '../../../../database/entities/harvest.entity';
import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { IListTopHarvestRequestDto } from '../../dtos/harvest/list-top-harvest.request.dto';

export interface IHarvestRepository extends IBaseRepository<Harvest> {
  findTotalAreaUsedByFarmId(farmId: string): Promise<number>;
  findTopHarvestsByYear(filters: IListTopHarvestRequestDto): Promise<Harvest[]>;
}
