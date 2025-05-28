import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProducerService } from './delete.service';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { Producer } from '../../../../../database/entities/producer.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';

describe('DeleteProducerService', () => {
  let service: DeleteProducerService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockProducerRepository = {
    findById: jest.fn(),
    softDelete: jest.fn(),
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
        DeleteProducerService,
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteProducerService>(DeleteProducerService);
    producerRepository = module.get('IProducerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully delete a producer', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateResult = { affected: 1 } as UpdateResult;

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.softDelete.mockResolvedValue(updateResult);

      const result = await service.perform(producerId);

      expect(result).toEqual(updateResult);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.softDelete).toHaveBeenCalledWith(
        existingProducer.id,
      );
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();

      producerRepository.findById.mockResolvedValue(null);

      await expect(service.perform(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when repository throws an error', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.softDelete.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(producerId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.softDelete).toHaveBeenCalledWith(
        existingProducer.id,
      );
    });

    it('should throw InternalServerErrorException when findById throws an error', async () => {
      const producerId = faker.string.uuid();

      producerRepository.findById.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(producerId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});
