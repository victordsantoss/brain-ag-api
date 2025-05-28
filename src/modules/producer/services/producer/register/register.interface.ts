import { Producer } from '../../../../../database/entities/producer.entity';
import { IRegisterProducerRequestDto } from '../../../dtos/producer/register.request.dto';

export interface IRegisterProducerService {
  perform(producer: IRegisterProducerRequestDto): Promise<Producer>;
}
