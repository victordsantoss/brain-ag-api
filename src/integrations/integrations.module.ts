import { Module } from '@nestjs/common';
import { ViacepModule } from './viacep/viacep.module';

@Module({
  imports: [ViacepModule],
  exports: [ViacepModule],
})
export class IntegrationsModule {}
