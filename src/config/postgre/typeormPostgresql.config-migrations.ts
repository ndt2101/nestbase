import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { setEnvVar } from '../env.config';
import cipher from '../../common/utils/cipher.utils';

setEnvVar();
const typeOrmPostgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_POSTGRESQL_HOST,
  port: parseInt(process.env.DB_POSTGRESQL_PORT) || 5432,
  username: cipher.decrypt(process.env.DB_POSTGRESQL_USERNAME),
  password: cipher.decrypt(process.env.DB_POSTGRESQL_PASSWORD),
  database: process.env.DB_POSTGRESQL_DATABASE,
  name: 'dcim',
  entities: ['dist/database/entities/postgre/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/postgre/*{.ts,.js}'],
  extra: {
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },
  logging: true
};

export default new DataSource(typeOrmPostgresConfig as DataSourceOptions);
