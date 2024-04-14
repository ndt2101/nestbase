import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import cipher from '../../common/utils/cipher.utils';
import { setEnvVar } from '../env.config'

setEnvVar()

export const typeOrmPostgresAsyncConfig: TypeOrmModuleAsyncOptions = {
  name: 'dcim',
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      name: 'dcim',
      type: 'postgres',
      host: process.env.DB_POSTGRESQL_HOST,
      port: parseInt(process.env.DB_POSTGRESQL_PORT) || 5432,
      username: cipher.decrypt(process.env.DB_POSTGRESQL_USERNAME),
      password: cipher.decrypt(process.env.DB_POSTGRESQL_PASSWORD),
      database: process.env.DB_POSTGRESQL_DATABASE,
      entities: ['dist/database/entities/postgre/*.entity{.ts,.js}'],
      autoLoadEntities: true
    };
  },
};
