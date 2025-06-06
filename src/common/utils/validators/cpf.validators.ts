import { Injectable } from '@nestjs/common';

@Injectable()
export class CpfValidator {
  constructor() {}

  public cleanCpf(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/\D/g, '');
  }

  public validateCpf(cpf: string): boolean {
    cpf = this.cleanCpf(cpf);
    if (cpf.length !== 11) {
      return false;
    }
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
    for (let i = 9; i < 11; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += parseInt(cpf[j]) * (i + 1 - j);
      }
      const digit = ((sum * 10) % 11) % 10;
      if (digit !== parseInt(cpf[i])) {
        return false;
      }
    }
    return true;
  }
}
