import {
  Inject,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { IRegisterHarvestRequestDto } from '../../../dtos/harvest/register.request.dto';
import { IRegisterHarvestService } from './register.service.interface';
import { IHarvestRepository } from '../../../repositories/harvest/harvest.interface';
import { IFarmRepository } from 'src/modules/producer/repositories/farm/farm.interface';
import { Farm } from 'src/database/entities/farm.entity';
import { ICultureRepository } from 'src/modules/harvest/repositories/culture/culture.interface';

@Injectable()
export class RegisterHarvestService implements IRegisterHarvestService {
  private readonly logger = new Logger(RegisterHarvestService.name);
  constructor(
    @Inject('IHarvestRepository')
    private readonly harvestRepository: IHarvestRepository,

    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,

    @Inject('ICultureRepository')
    private readonly cultureRepository: ICultureRepository,
  ) {}

  async perform(data: IRegisterHarvestRequestDto): Promise<any> {
    try {
      this.logger.log(`Executando perform`);
      const farm = await this.findFarmById(data.farmId);
      await this.validateArea(farm, data.area);
      await this.validateCulture(data.cultureId);

      return await this.harvestRepository.create({
        ...data,
        farm: { id: data.farmId },
        culture: { id: data.cultureId },
      });
    } catch (error) {
      throw error ?? new InternalServerErrorException(`Erro ao salvar safra`);
    }
  }

  private async findFarmById(farmId: string): Promise<Farm> {
    this.logger.log(`Executando findFarmById com o id ${farmId}`);
    const farm = await this.farmRepository.findById(farmId);
    if (!farm) {
      throw new BadRequestException('Fazenda não encontrada');
    }
    return farm;
  }

  private async validateCulture(cultureId: string): Promise<void> {
    this.logger.log(`Executando findCultureById com o id ${cultureId}`);
    const culture = await this.cultureRepository.findById(cultureId);
    if (!culture) {
      throw new BadRequestException('Cultura não encontrada');
    }
  }

  private async validateArea(farm: Farm, area: number): Promise<void> {
    this.logger.log(
      `Executando validateArea com a fazenda ${farm.id} e a área ${area}`,
    );
    const totalAreaUsed =
      await this.harvestRepository.findTotalAreaUsedByFarmId(farm.id);
    const newTotalArea = totalAreaUsed + area;

    if (newTotalArea > farm.cultivatedArea) {
      throw new BadRequestException(
        `A área total de plantio (${area} ha) somada a área já plantada (${totalAreaUsed} ha) excede a área agricultável da fazenda (${farm.cultivatedArea} ha)`,
      );
    }
  }
}
