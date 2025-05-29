import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Culture } from '../../../../database/entities/culture.entity';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { ICultureRepository } from './culture.interface';

@Injectable()
export class CultureRepository
  extends BaseRepository<Culture>
  implements ICultureRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource, Culture);
  }

  async findFarmCulture(farmId: string, cultureName: string): Promise<Culture> {
    return await this.repository.findOneBy({
      farm: { id: farmId },
      name: cultureName,
    });
  }
}
