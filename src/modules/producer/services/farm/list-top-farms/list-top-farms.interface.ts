import { IListTopFarmResponseDto } from '../../../dtos/farm/list-top-farms.response.dto';

export interface IListTopFarmsService {
  perform(): Promise<IListTopFarmResponseDto[]>;
}
