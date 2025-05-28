import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';

import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { IUpdateProducerRequestDto } from '../../../dtos/producer/update.request.dto';
import { UpdateResult } from 'typeorm';
import { IUpdateProducerService } from './update.interface';
import { Producer } from '../../../../../database/entities/producer.entity';

@Injectable()
export class UpdateProducerService implements IUpdateProducerService {
  private readonly logger = new Logger(UpdateProducerService.name);
  private readonly _emailField: keyof Producer = 'email';
  private readonly _cpfField: keyof Producer = 'cpf';

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(
    id: string,
    data: IUpdateProducerRequestDto,
  ): Promise<UpdateResult> {
    try {
      this.logger.log('Iniciando método perform');
      const producer = await this.findProducerById(id);
      await this.validateUniqueFields(producer, data);
      return await this.updateProducer(id, data);
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao atualizar produtor`)
      );
    }
  }

  private async findProducerById(id: string): Promise<Producer> {
    this.logger.log('Iniciando método findProducerById');
    const producer = await this.producerRepository.findById(id);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }
    return producer;
  }

  private async validateUniqueFields(
    producer: Producer,
    data: IUpdateProducerRequestDto,
  ): Promise<void> {
    this.logger.log('Iniciando método validateUniqueFields');
    if (data.email && data.email !== producer.email) {
      await this.validateEmail(data.email);
    }

    if (data.cpf && data.cpf !== producer.cpf) {
      await this.validateCpf(data.cpf);
    }
  }

  private async validateCpf(cpf: string): Promise<void> {
    this.logger.log('Iniciando método validateCpf');
    const existingProducer = await this.producerRepository.findOneBy(
      this.cpfField,
      cpf,
    );
    if (existingProducer) {
      throw new BadRequestException('CPF já cadastrado para outro produtor');
    }
  }

  private async validateEmail(email: string): Promise<void> {
    this.logger.log('Iniciando método validateEmail');
    const existingProducer = await this.producerRepository.findOneBy(
      this.emailField,
      email,
    );
    if (existingProducer) {
      throw new BadRequestException('Email já cadastrado para outro produtor');
    }
  }

  private async updateProducer(
    id: string,
    data: IUpdateProducerRequestDto,
  ): Promise<UpdateResult> {
    this.logger.log('Iniciando método updateProducer');
    return await this.producerRepository.update(id, data);
  }

  get emailField(): keyof Producer {
    return this._emailField;
  }

  get cpfField(): keyof Producer {
    return this._cpfField;
  }
}
