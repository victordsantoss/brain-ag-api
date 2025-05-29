import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IViacepService } from '../../../../integrations/viacep/services/viacep.interface';
import { CepGuard } from '../../../../common/guards/cep.guard';
import { AddressResponseDto } from '../../dtos/address/address.response.dto';

@ApiTags('Produtor')
@Controller('address')
export class AddressController {
  constructor(
    @Inject('IViacepService')
    private readonly viacepService: IViacepService,
  ) {}

  @Get(':cep')
  @UseGuards(CepGuard)
  @ApiOperation({ summary: 'Buscar endereço por CEP' })
  @ApiParam({
    name: 'cep',
    description: 'CEP para busca (apenas números)',
    example: '01001000',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado com sucesso',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'CEP inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Endereço não encontrado',
  })
  async findByCep(@Param('cep') cep: string): Promise<AddressResponseDto> {
    return this.viacepService.findByCep(cep);
  }
}
