import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { Culture } from '../../../../database/entities/culture.entity';

export interface ICultureRepository extends IBaseRepository<Culture> {
  findFarmCulture(farmId: string, cultureName: string): Promise<Culture>;
}
