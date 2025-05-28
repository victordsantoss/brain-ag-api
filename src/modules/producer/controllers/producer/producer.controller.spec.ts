import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { IRegisterProducerService } from '../../services/producer/register/register.interface';
import { Producer } from '../../../../database/entities/producer.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import {
  BadRequestException,
  CanActivate,
  InternalServerErrorException,
} from '@nestjs/common';
import { CpfGuard } from '../../../../common/guards/cpf.guard';

describe('ProducerController', () => {
  let controller: ProducerController;
  let registerProducerService: jest.Mocked<IRegisterProducerService>;

  const mockRegisterProducerService = {
    perform: jest.fn(),
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
    class CpfGuardMock implements CanActivate {
      canActivate(): boolean {
        return true;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: 'IRegisterProducerService',
          useValue: mockRegisterProducerService,
        },
      ],
    })
      .overrideGuard(CpfGuard)
      .useValue(new CpfGuardMock())
      .compile();

    controller = module.get<ProducerController>(ProducerController);
    registerProducerService = module.get('IRegisterProducerService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new producer', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      const mockCreatedProducer = createMockProducer();
      Object.assign(mockCreatedProducer, producerData);

      registerProducerService.perform.mockResolvedValue(mockCreatedProducer);

      const result = await controller.create(producerData);

      expect(result).toEqual(mockCreatedProducer);
      expect(registerProducerService.perform).toHaveBeenCalledWith(
        producerData,
      );
    });

    it('should throw BadRequestException when email is already in use', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      registerProducerService.perform.mockRejectedValue(
        new BadRequestException('Produtor com este email já existe'),
      );

      await expect(controller.create(producerData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerProducerService.perform).toHaveBeenCalledWith(
        producerData,
      );
    });

    it('should throw BadRequestException when CPF is already in use', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      registerProducerService.perform.mockRejectedValue(
        new BadRequestException('Produtor com este CPF já existe'),
      );

      await expect(controller.create(producerData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerProducerService.perform).toHaveBeenCalledWith(
        producerData,
      );
    });

    it('should throw InternalServerErrorException when service throws error', async () => {
      const producerData = {
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      registerProducerService.perform.mockRejectedValue(
        new InternalServerErrorException('Erro ao salvar produtor'),
      );

      await expect(controller.create(producerData)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(registerProducerService.perform).toHaveBeenCalledWith(
        producerData,
      );
    });
  });
});
