import { IProducersResponseDto } from '../../../dtos/producer/list.response.dto';
import { BasePaginationResponseDto } from '../../../../../common/dtos/base-pagination.response.dto';
import { IListProducersRequestDto } from '../../../dtos/producer/list.request.dto';

export interface IListProducersService {
  perform(
    query: IListProducersRequestDto,
  ): Promise<BasePaginationResponseDto<IProducersResponseDto>>;
}
