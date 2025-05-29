import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Address } from '../../../../database/entities/address.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IAddressRepository } from './address.interface';

@Injectable()
export class AddressRepository
  extends BaseRepository<Address>
  implements IAddressRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Address);
  }
}
