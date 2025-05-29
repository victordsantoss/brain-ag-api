import { IGetProducerResponseDto } from '../../../dtos/producer/get.response.dto';

export interface IGetProducerService {
  perform(id: string): Promise<IGetProducerResponseDto>;
}
