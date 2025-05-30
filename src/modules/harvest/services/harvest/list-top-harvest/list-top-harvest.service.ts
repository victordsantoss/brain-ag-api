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
    this.logger.log(
      `Buscando as 3 maiores safras com base na produção real, por ano, cultura ou estado`,
    );
    const harvests =
      await this.harvestRepository.findTopHarvestsByYear(filters);

    return harvests.map((harvest) => this.mapHarvestToResponse(harvest));
  }

  private mapHarvestToResponse(harvest: Harvest): IListTopHarvestResponseDto {
    this.logger.log('Mapeando resposta para o cliente');
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
