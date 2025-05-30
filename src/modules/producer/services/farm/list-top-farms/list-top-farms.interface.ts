import { IListTopFarmResponseDto } from '../../../dtos/farm/list-top-farms.response.dto';
import { IListTopFarmsRequestDto } from '../../../dtos/farm/list-top-farms.request.dto';

export interface IListTopFarmsService {
  perform(
    filters?: IListTopFarmsRequestDto,
  ): Promise<IListTopFarmResponseDto[]>;
}
