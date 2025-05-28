import { RegisterProducerService } from '../services/producer/register/register.service';
import { ListProducersService } from '../services/producer/list/list.service';
import { UpdateProducerService } from '../services/producer/update/update.service';
import { ProducerRepository } from '../repositories/producer/producer.repository';

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
    provide: 'IUpdateProducerService',
    useClass: UpdateProducerService,
  },
  {
    provide: 'IProducerRepository',
    useClass: ProducerRepository,
  },
];
