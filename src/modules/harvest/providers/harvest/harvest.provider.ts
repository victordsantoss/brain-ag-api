import { HarvestRepository } from '../../repositories/harvest/harvest.repository';
import { ListTopHarvestService } from '../../services/harvest/list-top-harvest/list-top-harvest.service';
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
  {
    provide: 'IListTopHarvestService',
    useClass: ListTopHarvestService,
  },
];
