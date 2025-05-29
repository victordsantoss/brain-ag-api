import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Culture } from '../../../../../database/entities/culture.entity';
import { IRegisterCultureRequestDto } from '../../../dtos/culture/register.request.dto';
import { IRegisterCultureService } from './register.service.interface';
import { ICultureRepository } from '../../../repositories/culture/culture.interface';

@Injectable()
export class RegisterCultureService implements IRegisterCultureService {
  private readonly logger = new Logger(RegisterCultureService.name);
  constructor(
    @Inject('ICultureRepository')
    private readonly cultureRepository: ICultureRepository,
  ) {}

  async perform(cultureData: IRegisterCultureRequestDto): Promise<Culture> {
    this.logger.log('Iniciando método perform');
    try {
      await this.findCultureByName(cultureData.farmId, cultureData.name);
      const newCulture = await this.cultureRepository.create({
        ...cultureData,
        farm: { id: cultureData.farmId },
      });
      return newCulture;
    } catch (error) {
      throw error ?? new InternalServerErrorException(`Erro ao salvar cultura`);
    }
  }

  private async findCultureByName(farmId: string, name: string) {
    this.logger.log('Iniciando método findCultureByName');
    const existingCulture = await this.cultureRepository.findFarmCulture(
      farmId,
      name,
    );
    if (existingCulture) {
      throw new BadRequestException(
        'Já existe uma cultura com este nome associada a esta propriedade',
      );
    }
  }
}
