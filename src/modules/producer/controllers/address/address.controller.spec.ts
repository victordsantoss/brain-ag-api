import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { IViacepService } from '../../../../integrations/viacep/services/viacep.interface';
import { ViacepAddressResponseDto } from '../../../../integrations/viacep/dtos/address.response';
import { NotFoundException, CanActivate } from '@nestjs/common';
import { CepGuard } from '../../../../common/guards/cep.guard';

describe('AddressController', () => {
  let controller: AddressController;
  let viacepService: jest.Mocked<IViacepService>;

  const mockViacepService = {
    findByCep: jest.fn(),
  };

  beforeEach(async () => {
    class CepGuardMock implements CanActivate {
      canActivate(): boolean {
        return true;
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: 'IViacepService',
          useValue: mockViacepService,
        },
      ],
    })
      .overrideGuard(CepGuard)
      .useValue(new CepGuardMock())
      .compile();

    controller = module.get<AddressController>(AddressController);
    viacepService = module.get('IViacepService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByCep', () => {
    it('should return address when CEP is valid', async () => {
      const mockAddress: ViacepAddressResponseDto = {
        cep: '01001000',
        street: 'Rua das Flores',
        complement: 'Apto 123',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        ibge: '3550308',
        gia: '1004',
        areaCode: '11',
        siafi: '7107',
      };

      viacepService.findByCep.mockResolvedValue(mockAddress);

      const result = await controller.findByCep('01001000');

      expect(result).toEqual(mockAddress);
      expect(viacepService.findByCep).toHaveBeenCalledWith('01001000');
    });

    it('should throw NotFoundException when address is not found', async () => {
      viacepService.findByCep.mockRejectedValue(
        new NotFoundException('Endereço não encontrado'),
      );

      await expect(controller.findByCep('99999999')).rejects.toThrow(
        NotFoundException,
      );
      expect(viacepService.findByCep).toHaveBeenCalledWith('99999999');
    });
  });
});
