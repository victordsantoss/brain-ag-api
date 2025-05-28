import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IRegisterProducerService } from './register.interface';
import { IProducerRepository } from 'src/modules/producer/repositories/producer/producer.interface';
import { IRegisterProducerRequestDto } from 'src/modules/producer/dtos/producer/register.request.dto';
import { Producer } from 'src/database/entities/producer.entity';

@Injectable()
export class RegisterProducerService implements IRegisterProducerService {
  private readonly _emailField: keyof Producer = 'email';
  private readonly _cpfField: keyof Producer = 'cpf';

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async perform(producer: IRegisterProducerRequestDto): Promise<Producer> {
    try {
      await this.findProducerByEmail(producer.email);
      await this.findProducerByCpf(producer.cpf);
      const newProducer = await this.producerRepository.create(producer);
      return newProducer;
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao salvar produtor`)
      );
    }
  }

  private async findProducerByEmail(email: string) {
    const existingProducerByEmail = await this.producerRepository.findOneBy(
      this.emailField,
      email,
    );

    if (existingProducerByEmail) {
      throw new BadRequestException('Produtor com este email já existe');
    }
  }

  private async findProducerByCpf(cpf: string) {
    const existingProducerByCpf = await this.producerRepository.findOneBy(
      this.cpfField,
      cpf,
    );

    if (existingProducerByCpf) {
      throw new BadRequestException('Produtor com este CPF já existe');
    }
  }

  get emailField(): keyof Producer {
    return this._emailField;
  }

  get cpfField(): keyof Producer {
    return this._cpfField;
  }
}
