import { Global, Module, Session } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpfValidator } from './utils/validators/cpf.validators';

@Global()
@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Session], 'brainagriculture')],
  providers: [CpfValidator],
  exports: [CpfValidator],
})
export class CommonModule {}
