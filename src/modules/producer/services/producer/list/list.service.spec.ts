import { Test, TestingModule } from '@nestjs/testing';
import { ListProducersService } from './list.service';
import { IProducerRepository } from '../../../repositories/producer/producer.interface';
import { Producer } from '../../../../../database/entities/producer.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../../common/enums/status.enum';

describe('ListProducersService', () => {
  let service: ListProducersService;
  let producerRepository: jest.Mocked<IProducerRepository>;

  const mockProducerRepository = {
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
    }) as Producer;

  const mapToResponse = (producer: Producer) => ({
    id: producer.id,
    name: producer.name,
    email: producer.email,
    cpf: producer.cpf,
    phone: producer.phone,
    status: producer.status,
    createdAt: producer.createdAt,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProducersService,
        {
          provide: 'IProducerRepository',
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ListProducersService>(ListProducersService);
    producerRepository = module.get('IProducerRepository');

    // Mock the mapToResponse method
    jest
      .spyOn(service as any, 'mapToResponse')
      .mockImplementation(mapToResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('perform', () => {
    it('should return paginated producers with default values', async () => {
      const query = {};

      const mockProducers = Array(3)
        .fill(null)
        .map(() => createMockProducer());

      producerRepository.findByFilters.mockResolvedValue([mockProducers, 3]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockProducers.map((producer) => ({
          id: producer.id,
          name: producer.name,
          email: producer.email,
          cpf: producer.cpf,
          phone: producer.phone,
          status: producer.status,
          createdAt: producer.createdAt,
        })),
        meta: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
        },
      });

      expect(producerRepository.findByFilters).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC',
      });
    });

    it('should return paginated producers with custom values', async () => {
      const query = {
        page: 2,
        limit: 5,
        orderBy: 'email',
        sortBy: 'DESC' as const,
      };

      const mockProducers = Array(5)
        .fill(null)
        .map(() => createMockProducer());

      producerRepository.findByFilters.mockResolvedValue([mockProducers, 12]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockProducers.map((producer) => ({
          id: producer.id,
          name: producer.name,
          email: producer.email,
          cpf: producer.cpf,
          phone: producer.phone,
          status: producer.status,
          createdAt: producer.createdAt,
        })),
        meta: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });

      expect(producerRepository.findByFilters).toHaveBeenCalledWith(query);
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

      producerRepository.findByFilters.mockResolvedValue([mockProducers, 2]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockProducers.map((producer) => ({
          id: producer.id,
          name: producer.name,
          email: producer.email,
          cpf: producer.cpf,
          phone: producer.phone,
          status: producer.status,
          createdAt: producer.createdAt,
        })),
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });

      expect(producerRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle empty results', async () => {
      const query = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC' as const,
        search: 'nonexistent',
      };

      producerRepository.findByFilters.mockResolvedValue([[], 0]);

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

      expect(producerRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle multiple pages with exact division', async () => {
      const query = {
        page: 2,
        limit: 5,
        orderBy: 'name',
        sortBy: 'ASC' as const,
      };

      const mockProducers = Array(5)
        .fill(null)
        .map(() => createMockProducer());

      producerRepository.findByFilters.mockResolvedValue([mockProducers, 10]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockProducers.map((producer) => ({
          id: producer.id,
          name: producer.name,
          email: producer.email,
          cpf: producer.cpf,
          phone: producer.phone,
          status: producer.status,
          createdAt: producer.createdAt,
        })),
        meta: {
          page: 2,
          limit: 5,
          total: 10,
          totalPages: 2,
        },
      });

      expect(producerRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle multiple pages with remainder', async () => {
      const query = {
        page: 3,
        limit: 5,
        orderBy: 'name',
        sortBy: 'ASC' as const,
      };

      const mockProducers = Array(2)
        .fill(null)
        .map(() => createMockProducer());

      producerRepository.findByFilters.mockResolvedValue([mockProducers, 12]);

      const result = await service.perform(query);

      expect(result).toEqual({
        data: mockProducers.map((producer) => ({
          id: producer.id,
          name: producer.name,
          email: producer.email,
          cpf: producer.cpf,
          phone: producer.phone,
          status: producer.status,
          createdAt: producer.createdAt,
        })),
        meta: {
          page: 3,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });

      expect(producerRepository.findByFilters).toHaveBeenCalledWith(query);
    });

    it('should handle repository error', async () => {
      const query = {
        page: 1,
        limit: 10,
        orderBy: 'name',
        sortBy: 'ASC' as const,
      };

      const error = new Error('Database error');
      producerRepository.findByFilters.mockRejectedValue(error);

      await expect(service.perform(query)).rejects.toThrow(error);
      expect(producerRepository.findByFilters).toHaveBeenCalledWith(query);
    });
  });
});
