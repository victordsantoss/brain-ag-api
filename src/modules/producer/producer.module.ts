import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from '../../database/entities/producer.entity';
import { Farm } from '../../database/entities/farm.entity';
import { ProducerController } from './controllers/producer/producer.controller';
import { FarmController } from './controllers/farm/farm.controller';
import { producerProviders } from './providers/producer.provider';
import { farmProviders } from './providers/farm.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, Farm])],
  controllers: [ProducerController, FarmController],
  providers: [...producerProviders, ...farmProviders],
})
export class ProducerModule {}
