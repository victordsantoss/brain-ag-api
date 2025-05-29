import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRegisterFarmRequestDto } from '../../../dtos/farm/register.request.dto';
import { Farm } from '../../../../../database/entities/farm.entity';
import { IRegisterFarmService } from './register.interface';
import { IFarmRepository } from 'src/modules/producer/repositories/farm/farm.interface';
import { IProducerRepository } from 'src/modules/producer/repositories/producer/producer.interface';

@Injectable()
export class RegisterFarmService implements IRegisterFarmService {
  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,

    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(farm: IRegisterFarmRequestDto): Promise<Farm> {
    try {
      await this.findProducerById(farm.producerId);
      const newFarm = await this.farmRepository.create({
        ...farm,
      });
      return newFarm;
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao salvar produtor`)
      );
    }
  }

  private async findProducerById(producerId: string): Promise<void> {
    const producer = await this.producerRepository.findById(producerId);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }
  }
}
