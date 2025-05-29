import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IViacepService } from './viacep.interface';
import { CepFormatter } from '../../../common/utils/formatters/cep.formatter';
import { ViacepAddressResponseDto } from '../dtos/address.response';

@Injectable()
export class ViacepService implements IViacepService {
  private readonly baseUrl = process.env.VIA_CEP_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  async findByCep(cep: string): Promise<ViacepAddressResponseDto> {
    try {
      const cleanedCep = CepFormatter.clean(cep);
      console.log(cleanedCep, this.baseUrl);

      const { data } = await firstValueFrom(
        this.httpService.get<ViacepAddressResponseDto>(
          `${this.baseUrl}/ws/${cleanedCep}/json`,
        ),
      );

      if (!data) {
        throw new NotFoundException('Endereço não encontrado');
      }

      return data;
    } catch (error) {
      throw (
        error ?? new InternalServerErrorException(`Erro ao salvar produtor`)
      );
    }
  }
}
