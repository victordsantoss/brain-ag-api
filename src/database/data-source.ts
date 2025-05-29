import { DataSource } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Producer } from './entities/producer.entity';
import { Farm } from './entities/farm.entity';
import { Crop } from './entities/crop.entity';
import { Harvest } from './entities/harvest.entity';
import { Address } from './entities/address.entity';

export const entities = [Producer, Farm, Address, Crop, Harvest];

export const createDataSource = () => {
  const port = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432;

  return new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    entities,
  });
};

export const BrainAgricultureForFeature: EntityClassOrSchema[] = entities;
