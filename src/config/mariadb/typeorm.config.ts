import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import cipher from '../../common/utils/cipher.utils';
import { setEnvVar } from '../env.config'

setEnvVar()

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  // name: 'it_brain',
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      // name: 'it_brain',
      type: 'mariadb',
      host: process.env.DB_MARIADB_HOST,
      port: parseInt(process.env.DB_MARIADB_PORT) || 3306,
      username: cipher.decrypt(process.env.DB_MARIADB_USERNAME),
      password: cipher.decrypt(process.env.DB_MARIADB_PASSWORD),
      database: process.env.DB_MARIADB_DATABASE,
      entities: ['dist/database/entities/mariadb/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/mariadb/*{.ts,.js}'],
      synchronize: process.env.DB_MARIADB_SYNCHRONIZE === 'true',
      autoLoadEntities: true,
      extra: {
        charset: 'utf8',
        collation: 'utf8_unicode_ci',
      },
      charset: 'utf8',
      logging: true,
    };
  },
};
