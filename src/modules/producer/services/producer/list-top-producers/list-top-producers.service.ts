import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { IListTopProducersService } from './list-top-producers.interface';
import { Producer } from '../../../../../database/entities/producer.entity';
import { ITopProducerResponseDto } from '../../../dtos/producer/list-top-producers.response.dto';

@Injectable()
export class ListTopProducersService implements IListTopProducersService {
  private readonly logger = new Logger(ListTopProducersService.name);

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(): Promise<ITopProducerResponseDto[]> {
    this.logger.log('Buscando os 3 maiores produtores por produção real');
    try {
      const producers =
        await this.producerRepository.findTopProducersByProduction();
      return producers.map((producer) => this.mapProducerToResponse(producer));
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao salvar produtor`)
      );
    }
  }

  private mapProducerToResponse(producer: Producer): ITopProducerResponseDto {
    const totalProduction = producer.farms.reduce((total, farm) => {
      const farmProduction = farm.harvests.reduce((farmTotal, harvest) => {
        return farmTotal + (Number(harvest.actualProduction) || 0);
      }, 0);
      return total + farmProduction;
    }, 0);

    return {
      id: producer.id,
      name: producer.name,
      totalProduction,
      farms: producer.farms.map((farm) => ({
        name: farm.name,
        production: farm.harvests.reduce((total, harvest) => {
          return total + (Number(harvest.actualProduction) || 0);
        }, 0),
      })),
    };
  }
}
