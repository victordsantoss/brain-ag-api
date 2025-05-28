import { BasePaginationResponseDto } from '../../../../../common/dtos/base-pagination.response.dto';
import { Producer } from '../../../../../database/entities/producer.entity';
import { IListProducersRequestDto } from '../../../dtos/producer/list.request.dto';

export interface IListProducersService {
  perform(
    query: IListProducersRequestDto,
  ): Promise<BasePaginationResponseDto<Producer>>;
}
