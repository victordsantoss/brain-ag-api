import { Test, TestingModule } from '@nestjs/testing';
import { RegisterHarvestService } from './register.service';
import { IHarvestRepository } from '../../../repositories/harvest/harvest.interface';
import { IFarmRepository } from '../../../../producer/repositories/farm/farm.interface';
import { ICultureRepository } from '../../../repositories/culture/culture.interface';
import { Harvest } from '../../../../../database/entities/harvest.entity';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Culture } from '../../../../../database/entities/culture.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import { HarvestSeason } from '../../../../../common/enums/harvest-season.enum';
import { NotFoundException } from '@nestjs/common';

describe('RegisterHarvestService', () => {
  let service: RegisterHarvestService;
  let harvestRepository: jest.Mocked<IHarvestRepository>;
  let farmRepository: jest.Mocked<IFarmRepository>;
  let cultureRepository: jest.Mocked<ICultureRepository>;

  const mockHarvestRepository = {
    create: jest.fn(),
    findTotalAreaUsedByFarmId: jest.fn().mockResolvedValue(100),
  };

  const mockFarmRepository = {
    findById: jest.fn(),
  };

  const mockCultureRepository = {
    findById: jest.fn(),
  };

  const createMockFarm = (): Partial<Farm> => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    totalArea: faker.number.float({
      min: 100,
      max: 1000,
      fractionDigits: 2,
    }),
    cultivatedArea: faker.number.float({
      min: 100,
      max: 500,
      fractionDigits: 2,
    }),
    vegetationArea: faker.number.float({
      min: 50,
      max: 500,
      fractionDigits: 2,
    }),
    status: BaseEntityStatus.ACTIVE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  });

  const createMockCulture = (): Partial<Culture> => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    farm: createMockFarm() as Farm,
    harvests: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  });

  const createMockHarvest = (): Partial<Harvest> => ({
    id: faker.string.uuid(),
    year: faker.number.int({ min: 1900, max: 2100 }),
    season: faker.helpers.enumValue(HarvestSeason),
    area: faker.number.float({
      min: 1,
      max: 40,
      fractionDigits: 2,
    }),
    expectedProduction: faker.number.float({
      min: 100,
      max: 10000,
      fractionDigits: 2,
    }),
    actualProduction: faker.number.float({
      min: 100,
      max: 10000,
      fractionDigits: 2,
    }),
    culture: createMockCulture() as Culture,
    farm: createMockFarm() as Farm,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterHarvestService,
        {
          provide: 'IHarvestRepository',
          useValue: mockHarvestRepository,
        },
        {
          provide: 'IFarmRepository',
          useValue: mockFarmRepository,
        },
        {
          provide: 'ICultureRepository',
          useValue: mockCultureRepository,
        },
      ],
    }).compile();

    service = module.get<RegisterHarvestService>(RegisterHarvestService);
    harvestRepository = module.get('IHarvestRepository');
    farmRepository = module.get('IFarmRepository');
    cultureRepository = module.get('ICultureRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully create a new harvest', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 40,
          fractionDigits: 2,
        }),
        expectedProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        actualProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        farmId: faker.string.uuid(),
        cultureId: faker.string.uuid(),
      };

      const mockFarm = createMockFarm();
      const mockCulture = createMockCulture();
      const mockCreatedHarvest = createMockHarvest();
      Object.assign(mockCreatedHarvest, harvestData);

      farmRepository.findById.mockResolvedValue(mockFarm as Farm);
      cultureRepository.findById.mockResolvedValue(mockCulture as Culture);
      harvestRepository.findTotalAreaUsedByFarmId.mockResolvedValue(0);
      harvestRepository.create.mockResolvedValue(mockCreatedHarvest as Harvest);

      const result = await service.perform(harvestData);

      expect(result).toEqual(mockCreatedHarvest);
      expect(farmRepository.findById).toHaveBeenCalledWith(harvestData.farmId);
      expect(cultureRepository.findById).toHaveBeenCalledWith(
        harvestData.cultureId,
      );

      expect(harvestRepository.create).toHaveBeenCalledWith({
        ...harvestData,
        farm: { id: harvestData.farmId },
        culture: { id: harvestData.cultureId },
      });
    });

    it('should throw BadRequestException when farm is not found', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 40,
          fractionDigits: 2,
        }),
        expectedProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        actualProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        farmId: faker.string.uuid(),
        cultureId: faker.string.uuid(),
      };

      farmRepository.findById.mockResolvedValue(null);

      await expect(service.perform(harvestData)).rejects.toThrow(
        NotFoundException,
      );

      expect(farmRepository.findById).toHaveBeenCalledWith(harvestData.farmId);
      expect(cultureRepository.findById).not.toHaveBeenCalled();
      expect(
        harvestRepository.findTotalAreaUsedByFarmId,
      ).not.toHaveBeenCalled();
      expect(harvestRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when culture is not found', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 40,
          fractionDigits: 2,
        }),
        expectedProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        actualProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        farmId: faker.string.uuid(),
        cultureId: faker.string.uuid(),
      };

      const mockFarm = createMockFarm();
      farmRepository.findById.mockResolvedValue(mockFarm as Farm);
      cultureRepository.findById.mockResolvedValue(null);

      await expect(service.perform(harvestData)).rejects.toThrow(
        NotFoundException,
      );

      expect(farmRepository.findById).toHaveBeenCalledWith(harvestData.farmId);
      expect(cultureRepository.findById).toHaveBeenCalledWith(
        harvestData.cultureId,
      );
      expect(harvestRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when repository throws error', async () => {
      const farmId = 'fdebbce5-2216-4cae-9b31-a309b8ae1d4f';
      const cultureId = '2b60dbd9-88ff-4bb5-bb94-1cfed9b32e0c';
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 40,
          fractionDigits: 2,
        }),
        expectedProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        actualProduction: faker.number.float({
          min: 100,
          max: 10000,
          fractionDigits: 2,
        }),
        farmId,
        cultureId,
      };

      const mockFarm = createMockFarm();
      const mockCulture = createMockCulture();
      farmRepository.findById.mockResolvedValue(mockFarm as Farm);
      cultureRepository.findById.mockResolvedValue(mockCulture as Culture);
      harvestRepository.findTotalAreaUsedByFarmId.mockResolvedValue(0);
      harvestRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.perform(harvestData)).rejects.toThrow(
        new Error('Database error'),
      );

      expect(farmRepository.findById).toHaveBeenCalledWith(farmId);
      expect(cultureRepository.findById).toHaveBeenCalledWith(cultureId);

      expect(harvestRepository.create).toHaveBeenCalledWith({
        ...harvestData,
        farm: { id: farmId },
        culture: { id: cultureId },
      });
    });
  });
});
