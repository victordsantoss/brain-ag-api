import { Producer } from '../../../../database/entities/producer.entity';
import { IRegisterProducerRequestDto } from '../../dtos/producer/register.request.dto';
import { IBaseRepository } from 'src/common/repositories/base.repository.interface';

export interface IProducerRepository
  extends IBaseRepository<Producer, IRegisterProducerRequestDto> {}
