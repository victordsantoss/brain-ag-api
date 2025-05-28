import { Module } from '@nestjs/common';
import { producerProviders } from './providers/producer.provider';
import { ProducerController } from './controllers/producer/producer.controller';

@Module({
  controllers: [ProducerController],
  providers: [...producerProviders],
  exports: [],
})
export class ProducerModule {}
