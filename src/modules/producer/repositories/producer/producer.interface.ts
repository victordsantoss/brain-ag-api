import { Producer } from '../../../../database/entities/producer.entity';
import { IRegisterProducerRequestDto } from '../../dtos/producer/register.request.dto';
import { IBaseRepository } from '../../../../common/repositories/base.repository.interface';
import { IListProducersRequestDto } from '../../dtos/producer/list.request.dto';
import { IUpdateProducerRequestDto } from '../../dtos/producer/update.request.dto';

export interface IProducerRepository
  extends IBaseRepository<
    Producer,
    IRegisterProducerRequestDto,
    IUpdateProducerRequestDto
  > {
  findByFilters(
    filters: IListProducersRequestDto,
  ): Promise<[Producer[], number]>;

  findByIdWithFarms(id: string): Promise<Producer>;
}
