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
  NotFoundException,
} from '@nestjs/common';
import { CpfGuard } from '../../../../common/guards/cpf.guard';
import { IListProducersService } from '../../services/producer/list/list.interface';
import { BasePaginationResponseDto } from '../../../../common/dtos/base-pagination.response.dto';
import { IListTopProducersService } from '../../services/producer/list-top-producers/list-top-producers.interface';
import { IGetProducerService } from '../../services/producer/get/get.interface';
import { IUpdateProducerService } from '../../services/producer/update/update.interface';
import { IDeleteProducerService } from '../../services/producer/delete/delete.interface';

describe('ProducerController', () => {
  let controller: ProducerController;
  let registerProducerService: jest.Mocked<IRegisterProducerService>;
  let listProducersService: jest.Mocked<IListProducersService>;
  let listTopProducersService: jest.Mocked<IListTopProducersService>;
  let getProducerService: jest.Mocked<IGetProducerService>;
  let updateProducerService: jest.Mocked<IUpdateProducerService>;
  let deleteProducerService: jest.Mocked<IDeleteProducerService>;

  const mockRegisterProducerService = {
    perform: jest.fn(),
  };

  const mockListProducersService = {
    perform: jest.fn(),
  };

  const mockUpdateProducerService = {
    perform: jest.fn(),
  };

  const mockDeleteProducerService = {
    perform: jest.fn(),
  };

  const mockGetProducerService = {
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
      deletedAt: null,
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
        {
          provide: 'IListProducersService',
          useValue: mockListProducersService,
        },
        {
          provide: 'IUpdateProducerService',
          useValue: mockUpdateProducerService,
        },
        {
          provide: 'IDeleteProducerService',
          useValue: mockDeleteProducerService,
        },
        {
          provide: 'IGetProducerService',
          useValue: mockGetProducerService,
        },
        {
          provide: 'IListTopProducersService',
          useValue: {
            perform: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(CpfGuard)
      .useValue(new CpfGuardMock())
      .compile();

    controller = module.get<ProducerController>(ProducerController);
    registerProducerService = module.get('IRegisterProducerService');
    listProducersService = module.get('IListProducersService');
    listTopProducersService = module.get('IListTopProducersService');
    getProducerService = module.get('IGetProducerService');
    updateProducerService = module.get('IUpdateProducerService');
    deleteProducerService = module.get('IDeleteProducerService');
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

  describe('list', () => {
    it('should return paginated producers without search', async () => {
      const query = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC' as const,
      };

      const mockProducers = Array(3)
        .fill(null)
        .map(() => createMockProducer());

      const expectedResponse: BasePaginationResponseDto<Producer> = {
        data: mockProducers,
        meta: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
        },
      };

      listProducersService.perform.mockResolvedValue(expectedResponse);

      const result = await controller.list(query);

      expect(result).toEqual(expectedResponse);
      expect(listProducersService.perform).toHaveBeenCalledWith(query);
    });

    it('should return paginated producers with search', async () => {
      const query = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC' as const,
        search: 'test',
      };

      const mockProducers = Array(2)
        .fill(null)
        .map(() => createMockProducer());

      const expectedResponse: BasePaginationResponseDto<Producer> = {
        data: mockProducers,
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      listProducersService.perform.mockResolvedValue(expectedResponse);

      const result = await controller.list(query);

      expect(result).toEqual(expectedResponse);
      expect(listProducersService.perform).toHaveBeenCalledWith(query);
    });

    it('should handle empty results', async () => {
      const query = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC' as const,
        search: 'nonexistent',
      };

      const expectedResponse: BasePaginationResponseDto<Producer> = {
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      listProducersService.perform.mockResolvedValue(expectedResponse);

      const result = await controller.list(query);

      expect(result).toEqual(expectedResponse);
      expect(listProducersService.perform).toHaveBeenCalledWith(query);
    });

    it('should handle multiple pages', async () => {
      const query = {
        page: 2,
        limit: 5,
        orderBy: 'name',
        sortBy: 'ASC' as const,
      };

      const mockProducers = Array(5)
        .fill(null)
        .map(() => createMockProducer());

      const expectedResponse: BasePaginationResponseDto<Producer> = {
        data: mockProducers,
        meta: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      };

      listProducersService.perform.mockResolvedValue(expectedResponse);

      const result = await controller.list(query);

      expect(result).toEqual(expectedResponse);
      expect(listProducersService.perform).toHaveBeenCalledWith(query);
    });
  });

  describe('listTopProducers', () => {
    it('should return top producers', async () => {
      const mockProducers = Array(3)
        .fill(null)
        .map(() => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          totalProduction: faker.number.float({ min: 0, max: 1000 }),
          farms: [
            {
              name: faker.company.name(),
              state: faker.location.state(),
              cultures: [faker.commerce.productName()],
              production: faker.number.float({ min: 0, max: 1000 }),
            },
          ],
        }));

      listTopProducersService.perform.mockResolvedValue(mockProducers);

      const result = await controller.listTopProducers();

      expect(result).toEqual(mockProducers);
      expect(listTopProducersService.perform).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      listTopProducersService.perform.mockResolvedValue([]);

      const result = await controller.listTopProducers();

      expect(result).toEqual([]);
      expect(listTopProducersService.perform).toHaveBeenCalled();
    });

    it('should handle service error', async () => {
      const error = new InternalServerErrorException();
      listTopProducersService.perform.mockRejectedValue(error);

      await expect(controller.listTopProducers()).rejects.toThrow(error);
      expect(listTopProducersService.perform).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return producer details', async () => {
      const producerId = faker.string.uuid();
      const mockProducer = createMockProducer();
      const expectedResponse = {
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

      getProducerService.perform.mockResolvedValue(expectedResponse);

      const result = await controller.get(producerId);

      expect(result).toEqual(expectedResponse);
      expect(getProducerService.perform).toHaveBeenCalledWith(producerId);
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();

      getProducerService.perform.mockRejectedValue(
        new NotFoundException('Produtor não encontrado'),
      );

      await expect(controller.get(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(getProducerService.perform).toHaveBeenCalledWith(producerId);
    });

    it('should handle service error', async () => {
      const producerId = faker.string.uuid();
      const error = new InternalServerErrorException();
      getProducerService.perform.mockRejectedValue(error);

      await expect(controller.get(producerId)).rejects.toThrow(error);
      expect(getProducerService.perform).toHaveBeenCalledWith(producerId);
    });
  });

  describe('update', () => {
    it('should update producer successfully', async () => {
      const producerId = faker.string.uuid();
      const updateData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      const mockUpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      updateProducerService.perform.mockResolvedValue(mockUpdateResult);

      const result = await controller.update(producerId, updateData);

      expect(result).toEqual(mockUpdateResult);
      expect(updateProducerService.perform).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();
      const updateData = {
        name: faker.person.fullName(),
      };

      updateProducerService.perform.mockRejectedValue(
        new NotFoundException('Produtor não encontrado'),
      );

      await expect(controller.update(producerId, updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(updateProducerService.perform).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });

    it('should handle service error', async () => {
      const producerId = faker.string.uuid();
      const updateData = {
        name: faker.person.fullName(),
      };
      const error = new InternalServerErrorException();
      updateProducerService.perform.mockRejectedValue(error);

      await expect(controller.update(producerId, updateData)).rejects.toThrow(
        error,
      );
      expect(updateProducerService.perform).toHaveBeenCalledWith(
        producerId,
        updateData,
      );
    });
  });

  describe('delete', () => {
    it('should delete producer successfully', async () => {
      const producerId = faker.string.uuid();
      const mockDeleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      deleteProducerService.perform.mockResolvedValue(mockDeleteResult);

      const result = await controller.delete(producerId);

      expect(result).toEqual(mockDeleteResult);
      expect(deleteProducerService.perform).toHaveBeenCalledWith(producerId);
    });

    it('should throw NotFoundException when producer is not found', async () => {
      const producerId = faker.string.uuid();

      deleteProducerService.perform.mockRejectedValue(
        new NotFoundException('Produtor não encontrado'),
      );

      await expect(controller.delete(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(deleteProducerService.perform).toHaveBeenCalledWith(producerId);
    });

    it('should handle service error', async () => {
      const producerId = faker.string.uuid();
      const error = new InternalServerErrorException();
      deleteProducerService.perform.mockRejectedValue(error);

      await expect(controller.delete(producerId)).rejects.toThrow(error);
      expect(deleteProducerService.perform).toHaveBeenCalledWith(producerId);
    });
  });
});
