import { Test, TestingModule } from '@nestjs/testing';
import { CultureController } from './culture.controller';
import { IRegisterCultureService } from '../../services/culture/register/register.service.interface';
import { Culture } from '../../../../database/entities/culture.entity';
import { Farm } from '../../../../database/entities/farm.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import {
  BadRequestException,
  CanActivate,
  InternalServerErrorException,
} from '@nestjs/common';
import { CpfGuard } from '../../../../common/guards/cpf.guard';

describe('CultureController', () => {
  let controller: CultureController;
  let registerCultureService: jest.Mocked<IRegisterCultureService>;

  const mockRegisterCultureService = {
    perform: jest.fn(),
  };

  const createMockFarm = (): Partial<Farm> => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    totalArea: faker.number.float({
      min: 100,
      max: 1000,
      fractionDigits: 2,
    }),
    cultivatedArea: faker.number.float({
      min: 50,
      max: 500,
      fractionDigits: 2,
    }),
    vegetationArea: faker.number.float({
      min: 50,
      max: 500,
      fractionDigits: 2,
    }),
    status: BaseEntityStatus.ACTIVE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  });

  const createMockCulture = (): Partial<Culture> => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    farm: createMockFarm() as Farm,
    harvests: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  });

  beforeEach(async () => {
    class CpfGuardMock implements CanActivate {
      canActivate(): boolean {
        return true;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultureController],
      providers: [
        {
          provide: 'IRegisterCultureService',
          useValue: mockRegisterCultureService,
        },
      ],
    })
      .overrideGuard(CpfGuard)
      .useValue(new CpfGuardMock())
      .compile();

    controller = module.get<CultureController>(CultureController);
    registerCultureService = module.get('IRegisterCultureService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new culture', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      const mockCreatedCulture = createMockCulture();
      Object.assign(mockCreatedCulture, cultureData);

      registerCultureService.perform.mockResolvedValue(
        mockCreatedCulture as Culture,
      );

      const result = await controller.create(cultureData);

      expect(result).toEqual(mockCreatedCulture);
      expect(registerCultureService.perform).toHaveBeenCalledWith(cultureData);
    });

    it('should throw BadRequestException when culture name already exists in the farm', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      registerCultureService.perform.mockRejectedValue(
        new BadRequestException(
          'Cultura com este nome já existe nesta fazenda',
        ),
      );

      await expect(controller.create(cultureData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerCultureService.perform).toHaveBeenCalledWith(cultureData);
    });

    it('should throw BadRequestException when farm is not found', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      registerCultureService.perform.mockRejectedValue(
        new BadRequestException('Fazenda não encontrada'),
      );

      await expect(controller.create(cultureData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerCultureService.perform).toHaveBeenCalledWith(cultureData);
    });

    it('should throw InternalServerErrorException when service throws error', async () => {
      const cultureData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        farmId: faker.string.uuid(),
      };

      registerCultureService.perform.mockRejectedValue(
        new InternalServerErrorException('Erro ao salvar cultura'),
      );

      await expect(controller.create(cultureData)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(registerCultureService.perform).toHaveBeenCalledWith(cultureData);
    });
  });
});
