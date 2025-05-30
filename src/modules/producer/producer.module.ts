import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from '../../database/entities/producer.entity';
import { Farm } from '../../database/entities/farm.entity';
import { ProducerController } from './controllers/producer/producer.controller';
import { FarmController } from './controllers/farm/farm.controller';
import { producerProviders } from './providers/producer.provider';
import { farmProviders } from './providers/farm.provider';
import { IntegrationsModule } from '../../integrations/integrations.module';
import { addressProviders } from './providers/address.provider';
import { AddressController } from './controllers/address/address.controller';
import { GetProducerService } from './services/producer/get/get.service';
import { ListTopFarmsService } from './services/farm/list-top-farms/list-top-farms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, Farm]), IntegrationsModule],
  controllers: [ProducerController, FarmController, AddressController],
  providers: [
    ...producerProviders,
    ...farmProviders,
    ...addressProviders,
    {
      provide: 'IGetProducerService',
      useClass: GetProducerService,
    },
    {
      provide: 'IListTopFarmsService',
      useClass: ListTopFarmsService,
    },
  ],
  exports: [...producerProviders, ...farmProviders, ...addressProviders],
})
export class ProducerModule {}
