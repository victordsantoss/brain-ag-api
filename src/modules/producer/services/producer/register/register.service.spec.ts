import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { Producer } from 'src/database/entities/producer.entity';
import { IProducerRepository } from 'src/modules/producer/repositories/producer/producer.interface';
import { RegisterProducerService } from './register.service';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';

describe('RegisterProducerService', () => {
  let service: RegisterProducerService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockProducerRepository = {
    create: jest.fn(),
    findOneBy: jest.fn(),
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
        RegisterProducerService,
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<RegisterProducerService>(RegisterProducerService);
    producerRepository = module.get('IProducerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should successfully create a new producer when no duplicates exist', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      const mockCreatedProducer = createMockProducer();
      Object.assign(mockCreatedProducer, producerData);

      // Simulating that no duplicates exist
      producerRepository.findOneBy.mockResolvedValue(null);
      producerRepository.create.mockResolvedValue(mockCreatedProducer);

      const result = await service.perform(producerData);

      expect(result).toEqual(mockCreatedProducer);

      // Verify that email validation was called
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        producerData.email,
      );

      // Verify that CPF validation was called
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'cpf',
        producerData.cpf,
      );

      expect(producerRepository.create).toHaveBeenCalledWith(producerData);
    });

    it('should throw BadRequestException when email validation finds duplicate', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      const existingProducer = createMockProducer();
      existingProducer.email = producerData.email;

      // Simulating duplicate email found
      producerRepository.findOneBy.mockResolvedValue(existingProducer);

      await expect(service.perform(producerData)).rejects.toThrow(
        BadRequestException,
      );

      // Verify that email validation was called
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        producerData.email,
      );

      // Verify that create was not called
      expect(producerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when CPF validation finds duplicate', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      // Mock email check passes but CPF check fails
      producerRepository.findOneBy
        .mockResolvedValueOnce(null) // email check passes
        .mockResolvedValueOnce(createMockProducer()); // cpf check - duplicate found

      await expect(service.perform(producerData)).rejects.toThrow(
        BadRequestException,
      );

      // Verify validations were called in order
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        producerData.email,
      );
      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'cpf',
        producerData.cpf,
      );

      // Verify that create was not called
      expect(producerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when repository throws error', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      // Simulating database error during validation
      producerRepository.findOneBy.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(producerData)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(producerRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        producerData.email,
      );
      expect(producerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when create operation fails', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      // All validations pass
      producerRepository.findOneBy.mockResolvedValue(null);
      // But creation fails
      producerRepository.create.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(service.perform(producerData)).rejects.toThrow(
        InternalServerErrorException,
      );

      // Verify all validations were called
      expect(producerRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(producerRepository.create).toHaveBeenCalledWith(producerData);
    });
  });
});
