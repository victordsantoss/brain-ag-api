import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRegisterFarmRequestDto } from '../../../dtos/farm/register.request.dto';
import { Farm } from '../../../../../database/entities/farm.entity';
import { IRegisterFarmService } from './register.interface';
import { IFarmRepository } from '../../../repositories/farm/farm.interface';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { IViacepService } from '../../../../../integrations/viacep/services/viacep.interface';
import { Address } from '../../../../../database/entities/address.entity';
import { IAddressRepository } from '../../../repositories/address/address.interface';

@Injectable()
export class RegisterFarmService implements IRegisterFarmService {
  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,

    @Inject('IAddressRepository')
    private readonly addressRepository: IAddressRepository,

    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,

    @Inject('IViacepService')
    private readonly viacepService: IViacepService,
  ) {}

  async perform(farm: IRegisterFarmRequestDto): Promise<Farm> {
    try {
      await this.findProducerById(farm.producerId);
      await this.validateCep(farm.address.zipCode);
      const address = await this.createAddress(farm.address);
      const created = await this.farmRepository.create({
        ...farm,
        producer: { id: farm.producerId },
        address: { id: address.id },
      });
      return created;
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao salvar produtor`)
      );
    }
  }

  private async createAddress(
    address: IRegisterFarmRequestDto['address'],
  ): Promise<Address> {
    const created = await this.addressRepository.create(address);
    return created;
  }

  private async findProducerById(producerId: string): Promise<void> {
    const producer = await this.producerRepository.findById(producerId);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }
  }

  private async validateCep(cep: string): Promise<void> {
    const address = await this.viacepService.findByCep(cep);
    if (!address) {
      throw new NotFoundException('CEP não encontrado');
    }
  }
}
