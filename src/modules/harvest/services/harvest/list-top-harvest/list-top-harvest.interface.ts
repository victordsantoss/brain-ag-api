import { IListTopHarvestRequestDto } from '../../../dtos/harvest/list-top-harvest.request.dto';
import { IListTopHarvestResponseDto } from '../../../dtos/harvest/list-top-harvest.response.dto';

export interface IListTopHarvestService {
  perform(
    filters: IListTopHarvestRequestDto,
  ): Promise<IListTopHarvestResponseDto[]>;
}
