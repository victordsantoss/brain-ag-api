import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { IRegisterFarmService } from '../../services/farm/register/register.interface';
import { Farm } from '../../../../database/entities/farm.entity';
import { Address } from '../../../../database/entities/address.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('FarmController', () => {
  let controller: FarmController;
  let registerFarmService: jest.Mocked<IRegisterFarmService>;

  const mockRegisterFarmService = {
    perform: jest.fn(),
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

  const createMockFarm = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    totalArea: faker.number.float({ min: 0, max: 1000 }),
    cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
    vegetationArea: faker.number.float({ min: 0, max: 1000 }),
    status: BaseEntityStatus.ACTIVE,
    address: createMockAddress,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as Farm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: 'IRegisterFarmService',
          useValue: mockRegisterFarmService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    registerFarmService = module.get('IRegisterFarmService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new farm', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
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

      registerFarmService.perform.mockResolvedValue(createMockFarm);

      const result = await controller.create(farmData);

      expect(result).toEqual(createMockFarm);
      expect(registerFarmService.perform).toHaveBeenCalledWith(farmData);
    });

    it('should throw BadRequestException when service throws error', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
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

      registerFarmService.perform.mockRejectedValue(
        new BadRequestException('Erro ao criar fazenda'),
      );

      await expect(controller.create(farmData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerFarmService.perform).toHaveBeenCalledWith(farmData);
    });

    it('should throw InternalServerErrorException when service throws error', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
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

      registerFarmService.perform.mockRejectedValue(
        new InternalServerErrorException('Erro ao salvar fazenda'),
      );

      await expect(controller.create(farmData)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(registerFarmService.perform).toHaveBeenCalledWith(farmData);
    });
  });
});
