import { IListFarmsRequestDto } from '../../../dtos/farm/list.request.dto';
import { IFarmsResponseDto } from '../../../dtos/farm/list.response.dto';
import { BasePaginationResponseDto } from '../../../../../common/dtos/base-pagination.response.dto';

export interface IListFarmsService {
  perform(
    query: IListFarmsRequestDto,
  ): Promise<BasePaginationResponseDto<IFarmsResponseDto>>;
}
