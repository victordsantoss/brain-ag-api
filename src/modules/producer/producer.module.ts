import { Module } from '@nestjs/common';
import { producerProviders } from './providers/producer.provider';
import { ProducerController } from './controllers/producer/producer.controller';
import { IntegrationsModule } from '../../integrations/integrations.module';
import { AddressController } from './controllers/address/address.controller';

@Module({
  imports: [IntegrationsModule],
  controllers: [ProducerController, AddressController],
  providers: [...producerProviders],
  exports: [],
})
export class ProducerModule {}
