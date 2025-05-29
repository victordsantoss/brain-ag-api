import { Test, TestingModule } from '@nestjs/testing';
import { ViacepService } from './viacep.service';
import { HttpService } from '@nestjs/axios';
import { ViacepAddressResponseDto } from '../dtos/address.response';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { faker } from '@faker-js/faker';

describe('ViacepService', () => {
  let service: ViacepService;
  let httpService: jest.Mocked<HttpService>;
  const baseUrl = process.env.VIA_CEP_BASE_URL;

  const mockHttpService = {
    get: jest.fn(),
  };

  const createMockAddress = (): ViacepAddressResponseDto => ({
    cep: faker.location.zipCode('########'),
    street: faker.location.street(),
    complement: faker.location.secondaryAddress(),
    district: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    ibge: faker.string.numeric(7),
    gia: faker.string.numeric(4),
    areaCode: faker.string.numeric(2),
    siafi: faker.string.numeric(4),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViacepService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ViacepService>(ViacepService);
    httpService = module.get(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByCep', () => {
    it('should return address when CEP is valid', async () => {
      const mockAddress = createMockAddress();
      const mockResponse: AxiosResponse<ViacepAddressResponseDto> = {
        data: mockAddress,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await service.findByCep(mockAddress.cep);

      expect(result).toEqual(mockAddress);
      expect(httpService.get).toHaveBeenCalledWith(
        `${baseUrl}/ws/${mockAddress.cep}/json`,
      );
    });

    it('should throw NotFoundException when address is not found', async () => {
      const mockResponse: AxiosResponse<null> = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const invalidCep = faker.string.numeric(8);
      httpService.get.mockReturnValue(of(mockResponse));

      await expect(service.findByCep(invalidCep)).rejects.toThrow(
        NotFoundException,
      );
      expect(httpService.get).toHaveBeenCalledWith(
        `${baseUrl}/ws/${invalidCep}/json`,
      );
    });

    it('should throw NotFoundException when API returns error', async () => {
      const invalidCep = faker.string.numeric(8);
      httpService.get.mockReturnValue(throwError(() => new Error('API Error')));

      await expect(service.findByCep(invalidCep)).rejects.toThrow(
        new Error('API Error'),
      );
      expect(httpService.get).toHaveBeenCalledWith(
        `${baseUrl}/ws/${invalidCep}/json`,
      );
    });

    it('should throw InternalServerErrorException when unexpected error occurs', async () => {
      const invalidCep = faker.string.numeric(8);
      httpService.get.mockReturnValue(
        throwError(() => new InternalServerErrorException()),
      );

      await expect(service.findByCep(invalidCep)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(httpService.get).toHaveBeenCalledWith(
        `${baseUrl}/ws/${invalidCep}/json`,
      );
    });

    it('should clean CEP before making request', async () => {
      const mockAddress = createMockAddress();
      const mockResponse: AxiosResponse<ViacepAddressResponseDto> = {
        data: mockAddress,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const formattedCep = `${mockAddress.cep.slice(0, 5)}-${mockAddress.cep.slice(5)}`;
      await service.findByCep(formattedCep);

      expect(httpService.get).toHaveBeenCalledWith(
        `${baseUrl}/ws/${mockAddress.cep}/json`,
      );
    });
  });
});
