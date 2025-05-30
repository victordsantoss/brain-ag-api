import { ITopProducerResponseDto } from '../../../dtos/producer/list-top-producers.response.dto';

export interface IListTopProducersService {
  perform(): Promise<ITopProducerResponseDto[]>;
}
