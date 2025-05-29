import {
  Injectable,
  NotFoundException,
  Logger,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';

import { UpdateResult } from 'typeorm';
import { Producer } from '../../../../../database/entities/producer.entity';
import { IDeleteProducerService } from './delete.interface';

@Injectable()
export class DeleteProducerService implements IDeleteProducerService {
  private readonly logger = new Logger(DeleteProducerService.name);

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(id: string): Promise<UpdateResult> {
    this.logger.log(`Iniciando exclusão lógica do produtor com ID: ${id}`);

    try {
      this.logger.log(`Iniciando exclusão lógica do produtor com ID: ${id}`);
      const producer = await this.findProducerById(id);
      return await this.producerRepository.softDelete(producer.id);
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao deletar produtor`)
      );
    }
  }

  private async findProducerById(id: string): Promise<Producer> {
    const existingProducer = await this.producerRepository.findById(id);
    if (!existingProducer) {
      throw new NotFoundException('Produtor não encontrado');
    }
    return existingProducer;
  }
}
