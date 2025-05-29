import { Test, TestingModule } from '@nestjs/testing';
import { RegisterFarmService } from './register.service';
import { IFarmRepository } from '../../../repositories/farm/farm.interface';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { Farm } from '../../../../../database/entities/farm.entity';
import { Producer } from '../../../../../database/entities/producer.entity';
import { Address } from '../../../../../database/entities/address.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('RegisterFarmService', () => {
  let service: RegisterFarmService;
  let farmRepository: jest.Mocked<IFarmRepository>;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const createMockProducer = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    cpf: faker.string.numeric(11),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    status: BaseEntityStatus.ACTIVE,
    farms: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as Producer;

  const mockProducerRepository = {
    findById: jest.fn().mockResolvedValue(createMockProducer),
  };

  const createMockAddress = {
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
  } as Address;

  const mockAddressRepository = {
    create: jest.fn().mockResolvedValue(createMockAddress),
  };

  const mockViacepService = {
    findByCep: jest.fn().mockResolvedValue({}),
  };

  const createMockFarm = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    totalArea: faker.number.float({ min: 0, max: 1000 }),
    arableArea: faker.number.float({ min: 0, max: 1000 }),
    vegetationArea: faker.number.float({ min: 0, max: 1000 }),
    status: BaseEntityStatus.ACTIVE,
    address: createMockAddress,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as Farm;

  const mockFarmRepository = {
    create: jest.fn().mockResolvedValue(createMockFarm),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterFarmService,
        {
          provide: 'IFarmRepository',
          useValue: mockFarmRepository,
        },
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
        {
          provide: 'IAddressRepository',
          useValue: mockAddressRepository,
        },
        {
          provide: 'IViacepService',
          useValue: mockViacepService,
        },
      ],
    }).compile();

    service = module.get<RegisterFarmService>(RegisterFarmService);
    farmRepository = module.get('IFarmRepository');
    producerRepository = module.get('IProducerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully create a new farm', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        arableArea: faker.number.float({ min: 0, max: 1000 }),
        vegetationArea: faker.number.float({ min: 0, max: 1000 }),
        address: {
          street: faker.location.street(),
          number: faker.number.int({ min: 1, max: 9999 }).toString(),
          complement: faker.location.secondaryAddress(),
          neighborhood: faker.location.county(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode('#####-###'),
        },
      };

      producerRepository.findById.mockResolvedValue(createMockProducer);
      farmRepository.create.mockResolvedValue(createMockFarm);

      const result = await service.perform(farmData);

      expect(result).toEqual(createMockFarm);
      expect(producerRepository.findById).toHaveBeenCalledWith(
        farmData.producerId,
      );
      expect(farmRepository.create).toHaveBeenCalledWith({
        ...farmData,
        producer: { id: farmData.producerId },
        address: { id: createMockAddress.id },
      });
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        arableArea: faker.number.float({ min: 0, max: 1000 }),
        vegetationArea: faker.number.float({ min: 0, max: 1000 }),
        address: {
          street: faker.location.street(),
          number: faker.number.int({ min: 1, max: 9999 }).toString(),
          complement: faker.location.secondaryAddress(),
          neighborhood: faker.location.county(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode('#####-###'),
        },
      };

      producerRepository.findById.mockResolvedValue(null);

      await expect(service.perform(farmData)).rejects.toThrow(
        NotFoundException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(
        farmData.producerId,
      );
      expect(farmRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when create operation fails', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        arableArea: faker.number.float({ min: 0, max: 1000 }),
        vegetationArea: faker.number.float({ min: 0, max: 1000 }),
        address: {
          street: faker.location.street(),
          number: faker.number.int({ min: 1, max: 9999 }).toString(),
          complement: faker.location.secondaryAddress(),
          neighborhood: faker.location.county(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode('#####-###'),
        },
      };

      producerRepository.findById.mockResolvedValue(createMockProducer);
      farmRepository.create.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(farmData)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(
        farmData.producerId,
      );
      expect(farmRepository.create).toHaveBeenCalledWith({
        ...farmData,
        producer: { id: farmData.producerId },
        address: { id: createMockAddress.id },
      });
    });
  });
});
