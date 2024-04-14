import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { UserModule } from '../user/user.module';
import { DeparmentModule } from '../deparment/deparment.module';

@Module({
  imports: [UserModule, DeparmentModule],
  providers: [CronJobService]
})
export class CronJobModule {}
