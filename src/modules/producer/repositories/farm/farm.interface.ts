import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { Farm } from '../../../../database/entities/farm.entity';

export interface IFarmRepository extends IBaseRepository<Farm> {
  findTopFarmsByProduction(): Promise<Farm[]>;
}
