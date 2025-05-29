export class CepFormatter {
  static clean(cep: string): string {
    if (!cep) return '';
    const result = cep.replace(/\D/g, '');
    return result.length === 8 ? result : '';
  }

  static format(cep: string): string {
    const cleanCep = this.clean(cep);
    if (!cleanCep) return '';
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }

  static isValid(cep: string): boolean {
    const cleanCep = this.clean(cep);
    return cleanCep.length === 8;
  }
}
