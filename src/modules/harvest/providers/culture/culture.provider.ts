import { CultureRepository } from '../../repositories/culture/culture.repository';
import { RegisterCultureService } from '../../services/culture/register/register.service';

export const cultureProviders = [
  {
    provide: 'IRegisterCultureService',
    useClass: RegisterCultureService,
  },
  {
    provide: 'ICultureRepository',
    useClass: CultureRepository,
  },
];
