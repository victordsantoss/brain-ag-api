import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { IFarmRepository } from '../../../repositories/farm/farm.interface';
import { IListTopFarmsService } from './list-top-farms.interface';
import { Farm } from '../../../../../database/entities/farm.entity';
import { IListTopFarmResponseDto } from '../../../dtos/farm/list-top-farms.response.dto';
import { IListTopFarmsRequestDto } from '../../../dtos/farm/list-top-farms.request.dto';

@Injectable()
export class ListTopFarmsService implements IListTopFarmsService {
  private readonly logger = new Logger(ListTopFarmsService.name);

  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
  ) {}

  async perform(
    filters?: IListTopFarmsRequestDto,
  ): Promise<IListTopFarmResponseDto[]> {
    this.logger.log(
      'Buscando as 3 maiores propriedades rurais por produção real',
    );
    try {
      const farms = await this.farmRepository.findTopFarmsByProduction(filters);
      return farms.map((farm) => this.mapFarmToResponse(farm));
    } catch (error) {
      throw (
        error ??
        new InternalServerErrorException(`Erro ao buscar propriedades rurais`)
      );
    }
  }

  private mapFarmToResponse(farm: Farm): IListTopFarmResponseDto {
    this.logger.log('Mapeando resposta para o cliente');
    const totalProduction = farm.harvests.reduce((total, harvest) => {
      return total + (Number(harvest.actualProduction) || 0);
    }, 0);

    return {
      id: farm.id,
      name: farm.name,
      state: farm.address.state,
      totalProduction,
      producerName: farm.producer.name,
      cultures: farm.harvests.map((harvest) => harvest.culture.name),
    };
  }
}
