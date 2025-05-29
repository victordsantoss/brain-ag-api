import { AddressRepository } from '../repositories/address/address.repository';

export const addressProviders = [
  {
    provide: 'IAddressRepository',
    useClass: AddressRepository,
  },
];
