import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from '../../database/entities/producer.entity';
import { Farm } from '../../database/entities/farm.entity';
import { ProducerController } from './controllers/producer/producer.controller';
import { FarmController } from './controllers/farm/farm.controller';
import { producerProviders } from './providers/producer.provider';
import { farmProviders } from './providers/farm.provider';
import { IntegrationsModule } from 'src/integrations/integrations.module';
import { addressProviders } from './providers/address.provider';
import { AddressController } from './controllers/address/address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, Farm]), IntegrationsModule],
  controllers: [ProducerController, FarmController, AddressController],
  providers: [...producerProviders, ...farmProviders, ...addressProviders],
})
export class ProducerModule {}
