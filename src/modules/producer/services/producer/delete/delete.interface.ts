import { UpdateResult } from 'typeorm';

export interface IDeleteProducerService {
  perform(id: string): Promise<UpdateResult>;
}
