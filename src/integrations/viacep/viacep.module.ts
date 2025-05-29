import { Module } from '@nestjs/common';
import { ViacepService } from './services/viacep.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'IViacepService',
      useClass: ViacepService,
    },
  ],
  exports: ['IViacepService'],
})
export class ViacepModule {}
