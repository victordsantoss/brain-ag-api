import { UpdateResult } from 'typeorm';
import { IUpdateProducerRequestDto } from '../../../dtos/producer/update.request.dto';

export interface IUpdateProducerService {
  perform(id: string, data: IUpdateProducerRequestDto): Promise<UpdateResult>;
}
