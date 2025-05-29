import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Farm } from '../../../../database/entities/farm.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { IFarmRepository } from './farm.interface';

@Injectable()
export class FarmRepository
  extends BaseRepository<Farm>
  implements IFarmRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Farm);
  }
}
