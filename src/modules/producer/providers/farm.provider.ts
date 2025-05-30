import { FarmRepository } from '../repositories/farm/farm.repository';
import { RegisterFarmService } from '../services/farm/register/register.service';
import { ListFarmsService } from '../services/farm/list/list.service';

export const farmProviders = [
  {
    provide: 'IRegisterFarmService',
    useClass: RegisterFarmService,
  },
  {
    provide: 'IFarmRepository',
    useClass: FarmRepository,
  },
  {
    provide: 'IListFarmsService',
    useClass: ListFarmsService,
  },
];
