import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { setEnvVar } from '../env.config';
import cipher from '../../common/utils/cipher.utils';

setEnvVar();

const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mariadb',
    host: process.env.DB_MARIADB_HOST,
    port: parseInt(process.env.DB_MARIADB_PORT) || 3306,
    username: cipher.decrypt(process.env.DB_MARIADB_USERNAME),
    password: cipher.decrypt(process.env.DB_MARIADB_PASSWORD),
    database: process.env.DB_MARIADB_DATABASE,
    entities: ['dist/database/entities/mariadb/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/mariadb/*{.ts,.js}'],
    synchronize: process.env.DB_MARIADB_SYNCHRONIZE === 'true',
    name: 'it_brain',
    extra: {
      charset: 'utf8',
      collation: 'utf8_unicode_ci',
    },
    charset: 'utf8',
    logging: true,
};

export default new DataSource(typeOrmConfig as DataSourceOptions);
