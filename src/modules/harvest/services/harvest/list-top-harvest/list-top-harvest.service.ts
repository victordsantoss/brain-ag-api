import { Injectable, Inject, Logger } from '@nestjs/common';
import { IHarvestRepository } from '../../../repositories/harvest/harvest.interface';
import { IListTopHarvestService } from './list-top-harvest.interface';
import { IListTopHarvestRequestDto } from '../../../dtos/harvest/list-top-harvest.request.dto';
import { IListTopHarvestResponseDto } from '../../../dtos/harvest/list-top-harvest.response.dto';
import { Harvest } from '../../../../../database/entities/harvest.entity';

@Injectable()
export class ListTopHarvestService implements IListTopHarvestService {
  private readonly logger = new Logger(ListTopHarvestService.name);

  constructor(
    @Inject('IHarvestRepository')
    private readonly harvestRepository: IHarvestRepository,
  ) {}

  async perform(
    filters: IListTopHarvestRequestDto,
  ): Promise<IListTopHarvestResponseDto[]> {
    this.logger.log(`Buscando as 3 maiores culturas do ano ${filters.year}`);
    const harvests =
      await this.harvestRepository.findTopHarvestsByYear(filters);

    return harvests.map((harvest) => this.mapHarvestToResponse(harvest));
  }

  private mapHarvestToResponse(harvest: Harvest): IListTopHarvestResponseDto {
    return {
      id: harvest.culture.id,
      name: harvest.culture.name,
      farmName: harvest.farm.name,
      producerName: harvest.farm.producer.name,
      totalProduction: Number(harvest.actualProduction),
      totalArea: Number(harvest.area),
    };
  }
}
