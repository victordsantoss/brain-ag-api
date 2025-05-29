import {
  Injectable,
  NotFoundException,
  Logger,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { IGetProducerService } from './get.interface';
import { IGetProducerResponseDto } from '../../../dtos/producer/get.response.dto';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Producer } from '../../../../../database/entities/producer.entity';

@Injectable()
export class GetProducerService implements IGetProducerService {
  private readonly logger = new Logger(GetProducerService.name);

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(id: string): Promise<IGetProducerResponseDto> {
    this.logger.log(`Buscando detalhes do produtor com ID: ${id}`);

    try {
      const producer = await this.producerRepository.findByIdWithFarms(id);
      if (!producer) {
        throw new NotFoundException('Produtor não encontrado');
      }

      return this.mapProducerToResponse(producer);
    } catch (error) {
      throw (
        error ??
        new InternalServerErrorException(`Erro ao buscar detalhes do produtor`)
      );
    }
  }

  private mapProducerToResponse(producer: Producer): IGetProducerResponseDto {
    return {
      id: producer.id,
      name: producer.name,
      cpf: producer.cpf,
      email: producer.email,
      phone: producer.phone,
      status: producer.status,
      farms: producer.farms.map((farm: Farm) => ({
        id: farm.id,
        name: farm.name,
      })),
      createdAt: producer.createdAt,
    };
  }
}
