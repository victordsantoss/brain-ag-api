import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IRegisterProducerService } from './register.interface';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { IRegisterProducerRequestDto } from '../../../dtos/producer/register.request.dto';
import { Producer } from '../../../../../database/entities/producer.entity';
import { CpfValidator } from 'src/common/utils/validators/cpf.validators';

@Injectable()
export class RegisterProducerService implements IRegisterProducerService {
  private readonly logger = new Logger(RegisterProducerService.name);

  private readonly _emailField: keyof Producer = 'email';
  private readonly _cpfField: keyof Producer = 'cpf';

  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
    private readonly cpfValidator: CpfValidator,
  ) {}

  async perform(producer: IRegisterProducerRequestDto): Promise<Producer> {
    this.logger.log('Iniciando método perform');
    try {
      await this.findProducerByEmail(producer.email);
      await this.findProducerByCpf(this.cpfValidator.cleanCpf(producer.cpf));
      const newProducer = await this.producerRepository.create({
        ...producer,
        cpf: this.cpfValidator.cleanCpf(producer.cpf),
      });
      return newProducer;
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao salvar produtor`)
      );
    }
  }

  private async findProducerByEmail(email: string) {
    this.logger.log('Iniciando método findProducerByEmail');
    const existingProducerByEmail = await this.producerRepository.findOneBy(
      this.emailField,
      email,
    );

    if (existingProducerByEmail) {
      throw new BadRequestException('Produtor com este email já existe');
    }
  }

  private async findProducerByCpf(cpf: string) {
    this.logger.log('Iniciando método findProducerByCpf');
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
