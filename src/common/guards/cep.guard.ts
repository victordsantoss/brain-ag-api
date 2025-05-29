import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CepGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const cep = request.params.cep;

    if (!cep) {
      throw new BadRequestException('CEP é obrigatório');
    }

    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new BadRequestException('CEP deve conter 8 dígitos');
    }

    // Valida se o CEP contém apenas números
    if (!/^\d{8}$/.test(cleanCep)) {
      throw new BadRequestException('CEP deve conter apenas números');
    }

    // Atualiza o CEP no request para o formato limpo
    request.params.cep = cleanCep;

    // Armazena o CEP limpo em uma propriedade customizada do request
    request['cleanedCep'] = cleanCep;

    return true;
  }
}
