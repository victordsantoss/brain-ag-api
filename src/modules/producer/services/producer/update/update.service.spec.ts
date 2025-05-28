import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProducerService } from './update.service';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { Producer } from '../../../../../database/entities/producer.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

describe('UpdateProducerService', () => {
  let service: UpdateProducerService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockProducerRepository = {
    findById: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
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
        UpdateProducerService,
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateProducerService>(UpdateProducerService);
    producerRepository = module.get('IProducerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully update a producer', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
      };
      const updateResult = { affected: 1 } as UpdateResult;

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.update.mockResolvedValue(updateResult);

      const result = await service.perform(producerId, updateData);

      expect(result).toEqual(updateResult);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.update).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();
      const updateData = {
        name: faker.person.fullName(),
      };

      producerRepository.findById.mockResolvedValue(null);

      await expect(service.perform(producerId, updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when CPF is already in use', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        cpf: faker.string.numeric(11),
      };
      const existingProducerWithCpf = createMockProducer();

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.findOneBy.mockResolvedValue(existingProducerWithCpf);

      await expect(service.perform(producerId, updateData)).rejects.toThrow(
        BadRequestException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'cpf',
        updateData.cpf,
      );
      expect(producerRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when email is already in use', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        email: faker.internet.email(),
      };
      const existingProducerWithEmail = createMockProducer();

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.findOneBy.mockResolvedValue(existingProducerWithEmail);

      await expect(service.perform(producerId, updateData)).rejects.toThrow(
        BadRequestException,
      );
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        updateData.email,
      );
      expect(producerRepository.update).not.toHaveBeenCalled();
    });

    it('should not validate CPF when it is not being updated', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        name: faker.person.fullName(),
      };
      const updateResult = { affected: 1 } as UpdateResult;

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.update.mockResolvedValue(updateResult);

      const result = await service.perform(producerId, updateData);

      expect(result).toEqual(updateResult);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.findOneBy).not.toHaveBeenCalled();
      expect(producerRepository.update).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });

    it('should not validate email when it is not being updated', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        name: faker.person.fullName(),
      };
      const updateResult = { affected: 1 } as UpdateResult;

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.update.mockResolvedValue(updateResult);

      const result = await service.perform(producerId, updateData);

      expect(result).toEqual(updateResult);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.findOneBy).not.toHaveBeenCalled();
      expect(producerRepository.update).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });

    it('should allow updating to the same CPF', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        cpf: existingProducer.cpf,
      };
      const updateResult = { affected: 1 } as UpdateResult;

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.update.mockResolvedValue(updateResult);

      const result = await service.perform(producerId, updateData);

      expect(result).toEqual(updateResult);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.findOneBy).not.toHaveBeenCalled();
      expect(producerRepository.update).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });

    it('should allow updating to the same email', async () => {
      const producerId = faker.string.uuid();
      const existingProducer = createMockProducer();
      const updateData = {
        email: existingProducer.email,
      };
      const updateResult = { affected: 1 } as UpdateResult;

      producerRepository.findById.mockResolvedValue(existingProducer);
      producerRepository.update.mockResolvedValue(updateResult);

      const result = await service.perform(producerId, updateData);

      expect(result).toEqual(updateResult);
      expect(producerRepository.findById).toHaveBeenCalledWith(producerId);
      expect(producerRepository.findOneBy).not.toHaveBeenCalled();
      expect(producerRepository.update).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });
  });
});
