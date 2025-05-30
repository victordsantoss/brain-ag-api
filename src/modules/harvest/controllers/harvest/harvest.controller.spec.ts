import { Test, TestingModule } from '@nestjs/testing';
import { HarvestController } from './harvest.controller';
import { IRegisterHarvestService } from '../../services/harvest/register/register.service.interface';
import { Harvest } from '../../../../database/entities/harvest.entity';
import { Culture } from '../../../../database/entities/culture.entity';
import { Farm } from '../../../../database/entities/farm.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import { HarvestSeason } from '../../../../common/enums/harvest-season.enum';
import {
  BadRequestException,
  CanActivate,
  InternalServerErrorException,
} from '@nestjs/common';
import { CpfGuard } from '../../../../common/guards/cpf.guard';
import { IListTopHarvestService } from '../../services/harvest/list-top-harvest/list-top-harvest.interface';

describe('HarvestController', () => {
  let controller: HarvestController;
  let registerHarvestService: jest.Mocked<IRegisterHarvestService>;
  let listTopHarvestService: jest.Mocked<IListTopHarvestService>;

  const mockRegisterHarvestService = {
    perform: jest.fn(),
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
      min: 50,
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
      max: 1000,
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
    class CpfGuardMock implements CanActivate {
      canActivate(): boolean {
        return true;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [
        {
          provide: 'IRegisterHarvestService',
          useValue: mockRegisterHarvestService,
        },
        {
          provide: 'IListTopHarvestService',
          useValue: {
            perform: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(CpfGuard)
      .useValue(new CpfGuardMock())
      .compile();

    controller = module.get<HarvestController>(HarvestController);
    registerHarvestService = module.get('IRegisterHarvestService');
    listTopHarvestService = module.get('IListTopHarvestService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new harvest', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 1000,
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

      const mockCreatedHarvest = createMockHarvest();
      Object.assign(mockCreatedHarvest, harvestData);

      registerHarvestService.perform.mockResolvedValue(
        mockCreatedHarvest as Harvest,
      );

      const result = await controller.create(harvestData);

      expect(result).toEqual(mockCreatedHarvest);
      expect(registerHarvestService.perform).toHaveBeenCalledWith(harvestData);
    });

    it('should throw BadRequestException when culture is not found', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 1000,
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

      registerHarvestService.perform.mockRejectedValue(
        new BadRequestException('Cultura não encontrada'),
      );

      await expect(controller.create(harvestData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerHarvestService.perform).toHaveBeenCalledWith(harvestData);
    });

    it('should throw BadRequestException when area validation fails', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 1000,
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

      registerHarvestService.perform.mockRejectedValue(
        new BadRequestException(
          'A soma das áreas cultivadas e de vegetação não pode ser maior que a área total da fazenda',
        ),
      );

      await expect(controller.create(harvestData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerHarvestService.perform).toHaveBeenCalledWith(harvestData);
    });

    it('should throw InternalServerErrorException when service throws error', async () => {
      const harvestData = {
        year: faker.number.int({ min: 1900, max: 2100 }),
        season: faker.helpers.enumValue(HarvestSeason),
        area: faker.number.float({
          min: 1,
          max: 1000,
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

      registerHarvestService.perform.mockRejectedValue(
        new InternalServerErrorException('Erro ao salvar safra'),
      );

      await expect(controller.create(harvestData)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(registerHarvestService.perform).toHaveBeenCalledWith(harvestData);
    });
  });

  describe('listTopHarvests', () => {
    it('should return top harvests with filters', async () => {
      const filters = {
        year: 2024,
        cultureName: 'Soja',
        state: 'SP',
      };

      const mockHarvests = Array(3)
        .fill(null)
        .map(() => ({
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          farmName: faker.company.name(),
          producerName: faker.person.fullName(),
          totalProduction: faker.number.float({ min: 100, max: 10000 }),
          totalArea: faker.number.float({ min: 1, max: 1000 }),
        }));

      listTopHarvestService.perform.mockResolvedValue(mockHarvests);

      const result = await controller.listTopHarvests(filters);

      expect(result).toEqual(mockHarvests);
      expect(listTopHarvestService.perform).toHaveBeenCalledWith(filters);
    });

    it('should return top harvests with only year filter', async () => {
      const filters = {
        year: 2024,
      };

      const mockHarvests = Array(3)
        .fill(null)
        .map(() => ({
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          farmName: faker.company.name(),
          producerName: faker.person.fullName(),
          totalProduction: faker.number.float({ min: 100, max: 10000 }),
          totalArea: faker.number.float({ min: 1, max: 1000 }),
        }));

      listTopHarvestService.perform.mockResolvedValue(mockHarvests);

      const result = await controller.listTopHarvests(filters);

      expect(result).toEqual(mockHarvests);
      expect(listTopHarvestService.perform).toHaveBeenCalledWith(filters);
    });

    it('should handle empty results', async () => {
      const filters = {
        year: 2024,
        cultureName: 'Nonexistent',
      };

      listTopHarvestService.perform.mockResolvedValue([]);

      const result = await controller.listTopHarvests(filters);

      expect(result).toEqual([]);
      expect(listTopHarvestService.perform).toHaveBeenCalledWith(filters);
    });

    it('should handle service error', async () => {
      const filters = {
        year: 2024,
      };

      const error = new InternalServerErrorException();
      listTopHarvestService.perform.mockRejectedValue(error);

      await expect(controller.listTopHarvests(filters)).rejects.toThrow(error);
      expect(listTopHarvestService.perform).toHaveBeenCalledWith(filters);
    });
  });
});
