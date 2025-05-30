import { Test, TestingModule } from '@nestjs/testing';
import { ListTopFarmsService } from './list-top-farms.service';
import { IFarmRepository } from '../../../repositories/farm/farm.interface';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Producer } from '../../../../../database/entities/producer.entity';
import { Address } from '../../../../../database/entities/address.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import { IListTopFarmsRequestDto } from '../../../dtos/farm/list-top-farms.request.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('ListTopFarmsService', () => {
  let service: ListTopFarmsService;
  let farmRepository: jest.Mocked<IFarmRepository>;

  const mockFarmRepository = {
    findTopFarmsByProduction: jest.fn(),
  };

  const createMockProducer = (): Producer =>
    ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      status: BaseEntityStatus.ACTIVE,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }) as Producer;

  const createMockAddress = (): Address =>
    ({
      id: faker.string.uuid(),
      street: faker.location.street(),
      number: faker.number.int({ min: 1, max: 9999 }).toString(),
      complement: faker.location.secondaryAddress(),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode('#####-###'),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }) as Address;

  const createMockFarm = (): Farm =>
    ({
      id: faker.string.uuid(),
      name: faker.company.name(),
      totalArea: faker.number.float({ min: 0, max: 1000 }),
      cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
      vegetationArea: faker.number.float({ min: 0, max: 1000 }),
      status: BaseEntityStatus.ACTIVE,
      producer: createMockProducer(),
      address: createMockAddress(),
      harvests: [
        {
          id: faker.string.uuid(),
          culture: {
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
          },
          actualProduction: faker.number.float({ min: 0, max: 1000 }),
        },
      ],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }) as Farm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTopFarmsService,
        {
          provide: 'IFarmRepository',
          useValue: mockFarmRepository,
        },
      ],
    }).compile();

    service = module.get<ListTopFarmsService>(ListTopFarmsService);
    farmRepository = module.get('IFarmRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should return top farms without filters', async () => {
      const mockFarms = Array(3)
        .fill(null)
        .map(() => createMockFarm());

      farmRepository.findTopFarmsByProduction.mockResolvedValue(mockFarms);

      const result = await service.perform();

      expect(result).toEqual(
        mockFarms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          state: farm.address.state,
          totalProduction: farm.harvests.reduce(
            (total, harvest) => total + (Number(harvest.actualProduction) || 0),
            0,
          ),
          producerName: farm.producer.name,
          cultures: farm.harvests.map((harvest) => harvest.culture.name),
        })),
      );

      expect(farmRepository.findTopFarmsByProduction).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should return top farms with filters', async () => {
      const filters: IListTopFarmsRequestDto = {
        state: 'SP',
        cultureName: 'Soja',
      };

      const mockFarms = Array(3)
        .fill(null)
        .map(() => createMockFarm());

      farmRepository.findTopFarmsByProduction.mockResolvedValue(mockFarms);

      const result = await service.perform(filters);

      expect(result).toEqual(
        mockFarms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          state: farm.address.state,
          totalProduction: farm.harvests.reduce(
            (total, harvest) => total + (Number(harvest.actualProduction) || 0),
            0,
          ),
          producerName: farm.producer.name,
          cultures: farm.harvests.map((harvest) => harvest.culture.name),
        })),
      );

      expect(farmRepository.findTopFarmsByProduction).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should handle empty results', async () => {
      farmRepository.findTopFarmsByProduction.mockResolvedValue([]);

      const result = await service.perform();

      expect(result).toEqual([]);
      expect(farmRepository.findTopFarmsByProduction).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should handle farms with no harvests', async () => {
      const mockFarm = createMockFarm();
      mockFarm.harvests = [];

      farmRepository.findTopFarmsByProduction.mockResolvedValue([mockFarm]);

      const result = await service.perform();

      expect(result).toEqual([
        {
          id: mockFarm.id,
          name: mockFarm.name,
          state: mockFarm.address.state,
          totalProduction: 0,
          producerName: mockFarm.producer.name,
          cultures: [],
        },
      ]);

      expect(farmRepository.findTopFarmsByProduction).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should handle repository error', async () => {
      const error = new InternalServerErrorException();
      farmRepository.findTopFarmsByProduction.mockRejectedValue(error);

      await expect(service.perform()).rejects.toThrow(error);
      expect(farmRepository.findTopFarmsByProduction).toHaveBeenCalledWith(
        undefined,
      );
    });
  });
});
