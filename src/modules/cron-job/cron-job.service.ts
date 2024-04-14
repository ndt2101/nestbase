import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { DepartmentService } from '../deparment/department.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronJobService {
  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
  ) {}

  @Cron('0 0 1 * *')
  private async SyncUserData(): Promise<string> {
    return await this.userService.synchronizingDataUser();
  }

  @Cron('0 0 1 * *')
  private async SyncDepartmentData(): Promise<string> {
    return await this.departmentService.synchronizingDataDepartment();
  }
}
