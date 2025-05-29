import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { Address } from '../../../../database/entities/address.entity';

export interface IAddressRepository extends IBaseRepository<Address> {}
