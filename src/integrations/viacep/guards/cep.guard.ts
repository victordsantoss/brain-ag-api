import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { CepFormatter } from '../../../common/utils/formatters/cep.formatter';

@Injectable()
export class CepGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const cep = request.params.cep;

    if (!cep) {
      throw new BadRequestException('CEP é obrigatório');
    }

    const cleanCep = CepFormatter.clean(cep);

    if (!CepFormatter.isValid(cleanCep)) {
      throw new BadRequestException('CEP inválido');
    }
    return true;
  }
}
