import { FarmRepository } from '../repositories/farm/farm.repository';
import { RegisterFarmService } from '../services/farm/register/register.service';

export const farmProviders = [
  {
    provide: 'IRegisterFarmService',
    useClass: RegisterFarmService,
  },
  {
    provide: 'IFarmRepository',
    useClass: FarmRepository,
  },
];
