import { Test, TestingModule } from '@nestjs/testing';
import { ListFarmsService } from './list.service';
import { IFarmRepository } from '../../../repositories/farm/farm.interface';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Producer } from '../../../../../database/entities/producer.entity';
import { Address } from '../../../../../database/entities/address.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import { IListFarmsRequestDto } from '../../../dtos/farm/list.request.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('ListFarmsService', () => {
  let service: ListFarmsService;
  let farmRepository: jest.Mocked<IFarmRepository>;

  const mockFarmRepository = {
    findByFilters: jest.fn(),
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
        ListFarmsService,
        {
          provide: 'IFarmRepository',
          useValue: mockFarmRepository,
        },
      ],
    }).compile();

    service = module.get<ListFarmsService>(ListFarmsService);
    farmRepository = module.get('IFarmRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should return paginated farms with default values', async () => {
      const query = {};

      const mockFarms = Array(3)
        .fill(null)
        .map(() => createMockFarm());

      farmRepository.findByFilters.mockResolvedValue([mockFarms, 3]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockFarms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          totalArea: farm.totalArea,
          cultivatedArea: farm.cultivatedArea,
          vegetationArea: farm.vegetationArea,
          status: farm.status,
          cultures: farm.harvests.map((harvest) => harvest.culture.name),
          producer: {
            name: farm.producer.name,
          },
          address: {
            street: farm.address.street,
            number: farm.address.number,
            complement: farm.address.complement,
            neighborhood: farm.address.neighborhood,
            city: farm.address.city,
            state: farm.address.state,
            zipCode: farm.address.zipCode,
          },
          createdAt: farm.createdAt,
        })),
        meta: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
        },
      });

      expect(farmRepository.findByFilters).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC',
      });
    });

    it('should return paginated farms with custom values', async () => {
      const query: IListFarmsRequestDto = {
        page: 2,
        limit: 5,
        orderBy: 'createdAt',
        sortBy: 'DESC',
        search: 'test',
        producerId: faker.string.uuid(),
        state: 'SP',
        cultureName: 'Soja',
      };

      const mockFarms = Array(5)
        .fill(null)
        .map(() => createMockFarm());

      farmRepository.findByFilters.mockResolvedValue([mockFarms, 12]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockFarms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          totalArea: farm.totalArea,
          cultivatedArea: farm.cultivatedArea,
          vegetationArea: farm.vegetationArea,
          status: farm.status,
          cultures: farm.harvests.map((harvest) => harvest.culture.name),
          producer: {
            name: farm.producer.name,
          },
          address: {
            street: farm.address.street,
            number: farm.address.number,
            complement: farm.address.complement,
            neighborhood: farm.address.neighborhood,
            city: farm.address.city,
            state: farm.address.state,
            zipCode: farm.address.zipCode,
          },
          createdAt: farm.createdAt,
        })),
        meta: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });

      expect(farmRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle empty results', async () => {
      const query: IListFarmsRequestDto = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC',
        search: 'nonexistent',
      };

      farmRepository.findByFilters.mockResolvedValue([[], 0]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });

      expect(farmRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle multiple pages with exact division', async () => {
      const query: IListFarmsRequestDto = {
        page: 2,
        limit: 5,
        orderBy: 'name',
        sortBy: 'ASC',
      };

      const mockFarms = Array(5)
        .fill(null)
        .map(() => createMockFarm());

      farmRepository.findByFilters.mockResolvedValue([mockFarms, 10]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockFarms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          totalArea: farm.totalArea,
          cultivatedArea: farm.cultivatedArea,
          vegetationArea: farm.vegetationArea,
          status: farm.status,
          cultures: farm.harvests.map((harvest) => harvest.culture.name),
          producer: {
            name: farm.producer.name,
          },
          address: {
            street: farm.address.street,
            number: farm.address.number,
            complement: farm.address.complement,
            neighborhood: farm.address.neighborhood,
            city: farm.address.city,
            state: farm.address.state,
            zipCode: farm.address.zipCode,
          },
          createdAt: farm.createdAt,
        })),
        meta: {
          page: 2,
          limit: 5,
          total: 10,
          totalPages: 2,
        },
      });

      expect(farmRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle multiple pages with remainder', async () => {
      const query: IListFarmsRequestDto = {
        page: 3,
        limit: 5,
        orderBy: 'name',
        sortBy: 'ASC',
      };

      const mockFarms = Array(2)
        .fill(null)
        .map(() => createMockFarm());

      farmRepository.findByFilters.mockResolvedValue([mockFarms, 12]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockFarms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          totalArea: farm.totalArea,
          cultivatedArea: farm.cultivatedArea,
          vegetationArea: farm.vegetationArea,
          status: farm.status,
          cultures: farm.harvests.map((harvest) => harvest.culture.name),
          producer: {
            name: farm.producer.name,
          },
          address: {
            street: farm.address.street,
            number: farm.address.number,
            complement: farm.address.complement,
            neighborhood: farm.address.neighborhood,
            city: farm.address.city,
            state: farm.address.state,
            zipCode: farm.address.zipCode,
          },
          createdAt: farm.createdAt,
        })),
        meta: {
          page: 3,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });

      expect(farmRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle repository error', async () => {
      const query: IListFarmsRequestDto = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC',
      };

      const error = new InternalServerErrorException();
      farmRepository.findByFilters.mockRejectedValue(error);

      await expect(service.perform(query)).rejects.toThrow(error);
      expect(farmRepository.findByFilters).toHaveBeenCalledWith(query);
    });
  });
});
