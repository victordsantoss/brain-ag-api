import { Injectable, Inject, Logger } from '@nestjs/common';
import { IFarmRepository } from '../../../repositories/farm/farm.interface';
import { IListFarmsService } from './list.interface';
import { IListFarmsRequestDto } from '../../../dtos/farm/list.request.dto';
import { IFarmsResponseDto } from '../../../dtos/farm/list.response.dto';
import { BasePaginationResponseDto } from '../../../../../common/dtos/base-pagination.response.dto';
import { Farm } from '../../../../../database/entities/farm.entity';

@Injectable()
export class ListFarmsService implements IListFarmsService {
  private readonly logger = new Logger(ListFarmsService.name);

  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
  ) {}

  async perform(
    query: IListFarmsRequestDto,
  ): Promise<BasePaginationResponseDto<IFarmsResponseDto>> {
    this.logger.log('Buscando fazendas com paginação e filtros');
    const [farms, total] = await this.farmRepository.findByFilters(query);

    const totalPages = Math.ceil(total / query.limit);
    const currentPage = query.page;

    return {
      data: farms.map((farm) => this.mapFarmToResponse(farm)),
      meta: {
        total,
        page: currentPage,
        limit: query.limit,
        totalPages,
      },
    };
  }
  private mapFarmToResponse(farm: Farm): IFarmsResponseDto {
    return {
      id: farm.id,
      name: farm.name,
      totalArea: farm.totalArea,
      cultivatedArea: farm.cultivatedArea,
      vegetationArea: farm.vegetationArea,
      status: farm.status,
      producer: {
        name: farm.producer.name,
      },
      address: {
        street: farm.address.street,
        number: farm.address.number,
        complement: farm.address.complement,
        neighborhood: farm.address.neighborhood,
        city: farm.address.city,
        state: farm.address.state,
        zipCode: farm.address.zipCode,
      },
      createdAt: farm.createdAt,
    };
  }
}
