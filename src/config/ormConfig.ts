import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ['src/modules/**/entities/**.ts'],
  migrations: ['src/database/migrations/*{.js,.ts}'],
};

export const connectionSource = new DataSource(options);
