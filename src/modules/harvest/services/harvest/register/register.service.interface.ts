import { Harvest } from '../../../../../database/entities/harvest.entity';
import { IRegisterHarvestRequestDto } from '../../../dtos/harvest/register.request.dto';

export interface IRegisterHarvestService {
  perform(data: IRegisterHarvestRequestDto): Promise<Harvest>;
}
