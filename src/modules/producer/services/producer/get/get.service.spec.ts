import { Test, TestingModule } from '@nestjs/testing';
import { GetProducerService } from './get.service';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { Producer } from '../../../../../database/entities/producer.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('GetProducerService', () => {
  let service: GetProducerService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockProducerRepository = {
    findById: jest.fn(),
  };

  const createMockProducer = (): Producer =>
    ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      status: BaseEntityStatus.ACTIVE,
      farms: [],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }) as Producer;

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
      const mockProducer = createMockProducer();

      producerRepository.findById.mockResolvedValue(mockProducer);

      const result = await service.perform(producerId);

      expect(result).toEqual(mockProducer);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();

      producerRepository.findById.mockResolvedValue(null);

      await expect(service.perform(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
    });

    it('should throw InternalServerErrorException when repository throws an error', async () => {
      const producerId = faker.string.uuid();

      producerRepository.findById.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(producerId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
    });
  });
});
