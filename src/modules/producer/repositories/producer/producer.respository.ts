import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IProducerRepository } from './producer.interface';
import { Producer } from 'src/database/entities/producer.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class ProducerRepository
  extends BaseRepository<Producer>
  implements IProducerRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Producer);
  }
}
