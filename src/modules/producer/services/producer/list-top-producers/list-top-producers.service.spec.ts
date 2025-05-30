import { Test, TestingModule } from '@nestjs/testing';
import { ListTopProducersService } from './list-top-producers.service';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { Producer } from '../../../../../database/entities/producer.entity';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Address } from '../../../../../database/entities/address.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import { InternalServerErrorException } from '@nestjs/common';

describe('ListTopProducersService', () => {
  let service: ListTopProducersService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockProducerRepository = {
    findTopProducersByProduction: jest.fn(),
  };

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

  const createMockProducer = (): Producer =>
    ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      status: BaseEntityStatus.ACTIVE,
      farms: [createMockFarm()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }) as Producer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTopProducersService,
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ListTopProducersService>(ListTopProducersService);
    producerRepository = module.get('IProducerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should return top producers with their farms and production', async () => {
      const mockProducers = Array(3)
        .fill(null)
        .map(() => createMockProducer());

      producerRepository.findTopProducersByProduction.mockResolvedValue(
        mockProducers,
      );

      const result = await service.perform();

      expect(result).toEqual(
        mockProducers.map((producer) => ({
          id: producer.id,
          name: producer.name,
          totalProduction: producer.farms.reduce((total, farm) => {
            const farmProduction = farm.harvests.reduce(
              (farmTotal, harvest) =>
                farmTotal + (Number(harvest.actualProduction) || 0),
              0,
            );
            return total + farmProduction;
          }, 0),
          farms: producer.farms.map((farm) => ({
            name: farm.name,
            state: farm.address.state,
            cultures: farm.harvests.map((harvest) => harvest.culture.name),
            production: farm.harvests.reduce(
              (total, harvest) =>
                total + (Number(harvest.actualProduction) || 0),
              0,
            ),
          })),
        })),
      );

      expect(
        producerRepository.findTopProducersByProduction,
      ).toHaveBeenCalled();
    });

    it('should handle producers with no farms', async () => {
      const mockProducer = createMockProducer();
      mockProducer.farms = [];

      producerRepository.findTopProducersByProduction.mockResolvedValue([
        mockProducer,
      ]);

      const result = await service.perform();

      expect(result).toEqual([
        {
          id: mockProducer.id,
          name: mockProducer.name,
          totalProduction: 0,
          farms: [],
        },
      ]);

      expect(
        producerRepository.findTopProducersByProduction,
      ).toHaveBeenCalled();
    });

    it('should handle farms with no harvests', async () => {
      const mockProducer = createMockProducer();
      mockProducer.farms[0].harvests = [];

      producerRepository.findTopProducersByProduction.mockResolvedValue([
        mockProducer,
      ]);

      const result = await service.perform();

      expect(result).toEqual([
        {
          id: mockProducer.id,
          name: mockProducer.name,
          totalProduction: 0,
          farms: [
            {
              name: mockProducer.farms[0].name,
              state: mockProducer.farms[0].address.state,
              cultures: [],
              production: 0,
            },
          ],
        },
      ]);

      expect(
        producerRepository.findTopProducersByProduction,
      ).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      producerRepository.findTopProducersByProduction.mockResolvedValue([]);

      const result = await service.perform();

      expect(result).toEqual([]);
      expect(
        producerRepository.findTopProducersByProduction,
      ).toHaveBeenCalled();
    });

    it('should handle repository error', async () => {
      const error = new InternalServerErrorException();
      producerRepository.findTopProducersByProduction.mockRejectedValue(error);

      await expect(service.perform()).rejects.toThrow(error);
      expect(
        producerRepository.findTopProducersByProduction,
      ).toHaveBeenCalled();
    });
  });
});
