import { HarvestRepository } from '../../repositories/harvest/harvest.repository';
import { RegisterHarvestService } from '../../services/harvest/register/register.service';

export const harvestProviders = [
  {
    provide: 'IHarvestRepository',
    useClass: HarvestRepository,
  },
  {
    provide: 'IRegisterHarvestService',
    useClass: RegisterHarvestService,
  },
];
