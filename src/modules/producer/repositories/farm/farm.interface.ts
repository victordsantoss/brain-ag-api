import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { Farm } from '../../../../database/entities/farm.entity';
import { IListTopFarmsRequestDto } from '../../dtos/farm/list-top-farms.request.dto';
import { IListFarmsRequestDto } from '../../dtos/farm/list.request.dto';

export interface IFarmRepository extends IBaseRepository<Farm> {
  findTopFarmsByProduction(filters?: IListTopFarmsRequestDto): Promise<Farm[]>;
  findByFilters(filters: IListFarmsRequestDto): Promise<[Farm[], number]>;
}
