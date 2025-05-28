import { ProducerRepository } from '../repositories/producer/producer.respository';
import { RegisterProducerService } from '../services/producer/register/register.service';

export const producerProviders = [
  {
    provide: 'IRegisterProducerService',
    useClass: RegisterProducerService,
  },
  {
    provide: 'IProducerRepository',
    useClass: ProducerRepository,
  },
];
