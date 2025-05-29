import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Culture } from 'src/database/entities/culture.entity';
import { Harvest } from 'src/database/entities/harvest.entity';
import { CultureController } from './controllers/culture/culture.controller';
import { HarvestController } from './controllers/harvest/harvest.controller';
import { cultureProviders } from './providers/culture/culture.provider';
import { harvestProviders } from './providers/harvest/harvest.provider';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Culture, Harvest]), ProducerModule],
  controllers: [CultureController, HarvestController],
  providers: [...cultureProviders, ...harvestProviders],
  exports: [],
})
export class HarvestModule {}
