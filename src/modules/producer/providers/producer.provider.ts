import { ProducerRepository } from '../repositories/producer/producer.respository';
import { RegisterProducerService } from '../services/producer/register/register.service';
import { ListProducersService } from '../services/producer/list/list.service';

export const producerProviders = [
  {
    provide: 'IRegisterProducerService',
    useClass: RegisterProducerService,
  },
  {
    provide: 'IListProducersService',
    useClass: ListProducersService,
  },
  {
    provide: 'IProducerRepository',
    useClass: ProducerRepository,
  },
];
