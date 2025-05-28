import { DataSource } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';


export const entities = [];

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
    synchronize: false,
    entities,
  });
};

export const AgrodogForFeature: EntityClassOrSchema[] = entities;
