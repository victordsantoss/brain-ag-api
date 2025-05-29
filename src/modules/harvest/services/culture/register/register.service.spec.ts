import { Test, TestingModule } from '@nestjs/testing';
import { RegisterCultureService } from './register.service';
import { ICultureRepository } from '../../../repositories/culture/culture.interface';
import { Culture } from '../../../../../database/entities/culture.entity';
import { Farm } from '../../../../../database/entities/farm.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import { BadRequestException } from '@nestjs/common';

describe('RegisterCultureService', () => {
  let service: RegisterCultureService;
  let cultureRepository: jest.Mocked<ICultureRepository>;

  const mockCultureRepository = {
    create: jest.fn(),
    findFarmCulture: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterCultureService,
        {
          provide: 'ICultureRepository',
          useValue: mockCultureRepository,
        },
      ],
    }).compile();

    service = module.get<RegisterCultureService>(RegisterCultureService);
    cultureRepository = module.get('ICultureRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully create a new culture', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      const mockCreatedCulture = createMockCulture();
      Object.assign(mockCreatedCulture, cultureData);

      cultureRepository.findFarmCulture.mockResolvedValue(null);
      cultureRepository.create.mockResolvedValue(mockCreatedCulture as Culture);

      const result = await service.perform(cultureData);

      expect(result).toEqual(mockCreatedCulture);
      expect(cultureRepository.findFarmCulture).toHaveBeenCalledWith(
        cultureData.farmId,
        cultureData.name,
      );
      expect(cultureRepository.create).toHaveBeenCalledWith({
        ...cultureData,
        farm: { id: cultureData.farmId },
      });
    });

    it('should throw BadRequestException when culture name already exists in the farm', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      const existingCulture = createMockCulture();
      cultureRepository.findFarmCulture.mockResolvedValue(
        existingCulture as Culture,
      );

      await expect(service.perform(cultureData)).rejects.toThrow(
        BadRequestException,
      );

      expect(cultureRepository.findFarmCulture).toHaveBeenCalledWith(
        cultureData.farmId,
        cultureData.name,
      );
      expect(cultureRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when repository throws error', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      cultureRepository.findFarmCulture.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.perform(cultureData)).rejects.toThrow(
        new Error('Database error'),
      );

      expect(cultureRepository.findFarmCulture).toHaveBeenCalledWith(
        cultureData.farmId,
        cultureData.name,
      );
      expect(cultureRepository.create).not.toHaveBeenCalled();
    });
  });
});
