import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Culture } from 'src/database/entities/culture.entity';
import { CultureController } from './controllers/culture/culture.controller';
import { cultureProviders } from './providers/culture/culture.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Culture])],
  controllers: [CultureController],
  providers: [...cultureProviders],
  exports: [],
})
export class HarvestModule {}
