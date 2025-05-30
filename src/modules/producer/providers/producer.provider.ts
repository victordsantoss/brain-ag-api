import { RegisterProducerService } from '../services/producer/register/register.service';
import { ListProducersService } from '../services/producer/list/list.service';
import { UpdateProducerService } from '../services/producer/update/update.service';
import { DeleteProducerService } from '../services/producer/delete/delete.service';
import { ProducerRepository } from '../repositories/producer/producer.repository';
import { ListTopProducersService } from '../services/producer/list-top-producers/list-top-producers.service';
import { GetProducerService } from '../services/producer/get/get.service';

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
    provide: 'IDeleteProducerService',
    useClass: DeleteProducerService,
  },
  {
    provide: 'IProducerRepository',
    useClass: ProducerRepository,
  },
  {
    provide: 'IListTopProducersService',
    useClass: ListTopProducersService,
  },
  {
    provide: 'IGetProducerService',
    useClass: GetProducerService,
  },
];
