import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { typeOrmAsyncConfig } from './config/mariadb/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { IsUniqueConstraint } from '@common/validations/isUniqueConstraint.validator';
import { IsPostgreUniqueConstraint } from '@common/validations/isPostgreUniqueConstraint.validator';
import { DeparmentModule } from './modules/deparment/deparment.module';
import { ScheduleModule } from '@nestjs/schedule';

import { getEnvFile } from './config/env.config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@guards/auth.guard';
import { CronJobModule } from './modules/cron-job/cron-job.module';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { typeOrmPostgresAsyncConfig } from './config/postgre/typeormPostgresql.config';

import { AuthModule } from './modules/features/auth/auth.module';
import { ProcessModule } from './modules/process/process.module';
import { ProcessCategoryModule } from './modules/process-category/process-category.module';
import { FormatResponseInterceptor } from '@common/interceptors/format-response.interceptor';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UploadModule } from './modules/features/upload/upload.module';
import { InfrastructureModule } from './modules/dcim/infrastructure/infrastructure.module';
import { PodModule } from './modules/dcim/pod/pod.module';
import { RackModule } from './modules/dcim/rack/rack.module';
import { InfrastructureTypeModule } from './modules/dcim/infrastructure-type/infrastructure-type.module';
import { LocationModule } from './modules/dcim/location/location.module';
import { RegionModule } from './modules/dcim/region/region.module';
import { SiteModule } from './modules/dcim/site/site.module';
import { DeviceModule } from './modules/dcim/device/device.module';
import { VlanModule } from './modules/dcim/vlan/vlan.module';
import { ZoneModule } from './modules/dcim/zone/zone.module';
import { LoadBalancerModule } from './modules/dcim/load-balancer/load-balancer.module';
import { FirewallModule } from './modules/dcim/firewall/firewall.module';
import { FileUploadModule } from './modules/dcim/file-upload/file-upload.module';
import { ZoneAtttModule } from './modules/dcim/zone-attt/zone-attt.module';
import { ZoneSiteModule } from './modules/dcim/zone-site/zone-site.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public/'),
      serveStaticOptions: { index: false },
    }),
    ConfigModule.forRoot({
      envFilePath: getEnvFile(),
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // TypeOrmModule.forRootAsync(typeOrmPostgresAsyncConfig),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
    }),
    UserModule,
    RoleModule,
    AuthModule,
    PermissionModule,
    DeparmentModule,
    CronJobModule,
    ProcessModule,
    ProcessCategoryModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    UploadModule,
    InfrastructureModule,
    PodModule,
    InfrastructureTypeModule,
    RackModule,
    LocationModule,
    RegionModule,
    SiteModule,
    DeviceModule,
      VlanModule,
      ZoneModule,
      LoadBalancerModule,
      FirewallModule,
    FileUploadModule,
    VlanModule,
    ZoneModule,
    LoadBalancerModule,
    FirewallModule,
    ZoneAtttModule,
    ZoneSiteModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IsUniqueConstraint,
    IsPostgreUniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
