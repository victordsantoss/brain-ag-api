import { Producer } from 'src/database/entities/producer.entity';
import { IRegisterProducerRequestDto } from 'src/modules/producer/dtos/producer/register.request.dto';

export interface IRegisterProducerService {
  perform(producer: IRegisterProducerRequestDto): Promise<Producer>;
}
