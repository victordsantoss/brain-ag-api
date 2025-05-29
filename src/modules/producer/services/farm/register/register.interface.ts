import { Farm } from '../../../../../database/entities/farm.entity';
import { IRegisterFarmRequestDto } from '../../../dtos/farm/register.request.dto';

export interface IRegisterFarmService {
  perform(createFarmDto: IRegisterFarmRequestDto): Promise<Farm>;
}
