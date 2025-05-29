import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProducerModule } from './modules/producer/producer.module';
import { CommonModule } from './common/common.module';
import { HarvestModule } from './modules/harvest/harvest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    DatabaseModule,
    ProducerModule,
    HarvestModule,
  ],
})
export class AppModule {}
