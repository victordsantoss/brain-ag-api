import { Test, TestingModule } from '@nestjs/testing';
import { GetProducerService } from './get.service';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IGetProducerResponseDto } from '../../../dtos/producer/get.response.dto';
import { Producer } from '../../../../../database/entities/producer.entity';
import { Farm } from '../../../../../database/entities/farm.entity';

describe('GetProducerService', () => {
  let service: GetProducerService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockFarm: Partial<Farm> = {
    id: faker.string.uuid(),
    name: faker.company.name(),
  };

  const mockProducer: Partial<Producer> = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    cpf: faker.string.numeric(11),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    status: BaseEntityStatus.ACTIVE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    farms: [mockFarm as Farm],
  };

  const mockProducerRepository = {
    findByIdWithFarms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProducerService,
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<GetProducerService>(GetProducerService);
    producerRepository = module.get('IProducerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully get producer details', async () => {
      const producerId = faker.string.uuid();
      const expectedResponse: IGetProducerResponseDto = {
        id: mockProducer.id,
        name: mockProducer.name,
        cpf: mockProducer.cpf,
        email: mockProducer.email,
        phone: mockProducer.phone,
        status: mockProducer.status,
        farms: mockProducer.farms.map((farm) => ({
          id: farm.id,
          name: farm.name,
        })),
        createdAt: mockProducer.createdAt,
      };

      producerRepository.findByIdWithFarms.mockResolvedValue(
        mockProducer as Producer,
      );

      const result = await service.perform(producerId);

      expect(result).toEqual(expectedResponse);
      expect(producerRepository.findByIdWithFarms).toHaveBeenCalledWith(
        producerId,
      );
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();

      producerRepository.findByIdWithFarms.mockResolvedValue(null);

      await expect(service.perform(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(producerRepository.findByIdWithFarms).toHaveBeenCalledWith(
        producerId,
      );
    });

    it('should throw InternalServerErrorException when repository throws an error', async () => {
      const producerId = faker.string.uuid();

      producerRepository.findByIdWithFarms.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(producerId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(producerRepository.findByIdWithFarms).toHaveBeenCalledWith(
        producerId,
      );
    });
  });
});
