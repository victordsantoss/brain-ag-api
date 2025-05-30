import { Test, TestingModule } from '@nestjs/testing';
import { ListTopHarvestService } from './list-top-harvest.service';
import { IHarvestRepository } from '../../../repositories/harvest/harvest.interface';
import { Harvest } from '../../../../../database/entities/harvest.entity';
import { Culture } from '../../../../../database/entities/culture.entity';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Producer } from '../../../../../database/entities/producer.entity';
import { faker } from '@faker-js/faker';
import { InternalServerErrorException } from '@nestjs/common';

describe('ListTopHarvestService', () => {
  let service: ListTopHarvestService;
  let harvestRepository: jest.Mocked<IHarvestRepository>;

  const mockHarvestRepository = {
    findTopHarvestsByYear: jest.fn(),
  };

  const createMockProducer = (): Producer =>
    ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
    }) as Producer;

  const createMockFarm = (): Farm =>
    ({
      id: faker.string.uuid(),
      name: faker.company.name(),
      producer: createMockProducer(),
    }) as Farm;

  const createMockCulture = (): Culture =>
    ({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
    }) as Culture;

  const createMockHarvest = (): Harvest =>
    ({
      id: faker.string.uuid(),
      culture: createMockCulture(),
      farm: createMockFarm(),
      actualProduction: faker.number.float({ min: 0, max: 1000 }),
      area: faker.number.float({ min: 0, max: 1000 }),
    }) as Harvest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTopHarvestService,
        {
          provide: 'IHarvestRepository',
          useValue: mockHarvestRepository,
        },
      ],
    }).compile();

    service = module.get<ListTopHarvestService>(ListTopHarvestService);
    harvestRepository = module.get('IHarvestRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should return top harvests with filters', async () => {
      const filters = {
        year: 2024,
        cultureName: 'Soja',
        state: 'SP',
      };

      const mockHarvests = Array(3)
        .fill(null)
        .map(() => createMockHarvest());

      harvestRepository.findTopHarvestsByYear.mockResolvedValue(mockHarvests);

      const result = await service.perform(filters);

      expect(result).toEqual(
        mockHarvests.map((harvest) => ({
          id: harvest.culture.id,
          name: harvest.culture.name,
          farmName: harvest.farm.name,
          producerName: harvest.farm.producer.name,
          totalProduction: Number(harvest.actualProduction),
          totalArea: Number(harvest.area),
        })),
      );

      expect(harvestRepository.findTopHarvestsByYear).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should return top harvests with only year filter', async () => {
      const filters = {
        year: 2024,
      };

      const mockHarvests = Array(3)
        .fill(null)
        .map(() => createMockHarvest());

      harvestRepository.findTopHarvestsByYear.mockResolvedValue(mockHarvests);

      const result = await service.perform(filters);

      expect(result).toEqual(
        mockHarvests.map((harvest) => ({
          id: harvest.culture.id,
          name: harvest.culture.name,
          farmName: harvest.farm.name,
          producerName: harvest.farm.producer.name,
          totalProduction: Number(harvest.actualProduction),
          totalArea: Number(harvest.area),
        })),
      );

      expect(harvestRepository.findTopHarvestsByYear).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should handle empty results', async () => {
      const filters = {
        year: 2024,
      };

      harvestRepository.findTopHarvestsByYear.mockResolvedValue([]);

      const result = await service.perform(filters);

      expect(result).toEqual([]);
      expect(harvestRepository.findTopHarvestsByYear).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should handle repository error', async () => {
      const filters = {
        year: 2024,
      };

      const error = new InternalServerErrorException();
      harvestRepository.findTopHarvestsByYear.mockRejectedValue(error);

      await expect(service.perform(filters)).rejects.toThrow(error);
      expect(harvestRepository.findTopHarvestsByYear).toHaveBeenCalledWith(
        filters,
      );
    });
  });
});
