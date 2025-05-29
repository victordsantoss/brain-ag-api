import { ViacepAddressResponseDto } from '../dtos/address.response';

export interface IViacepService {
  findByCep(cep: string): Promise<ViacepAddressResponseDto>;
}
