import { Producer } from '../../../../database/entities/producer.entity';
import { IRegisterProducerRequestDto } from '../../dtos/producer/register.request.dto';
import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { IListProducersRequestDto } from '../../dtos/producer/list.request.dto';
import { IUpdateProducerRequestDto } from '../../dtos/producer/update.request.dto';
import { UpdateResult } from 'typeorm';

export interface IProducerRepository
  extends IBaseRepository<
    Producer,
    IRegisterProducerRequestDto,
    IUpdateProducerRequestDto
  > {
  findByFilters(
    filters: IListProducersRequestDto,
  ): Promise<[Producer[], number]>;

  update(id: string, data: IUpdateProducerRequestDto): Promise<UpdateResult>;
}
