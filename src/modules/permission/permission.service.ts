import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

export interface permissionInterface {
    title: string;
    name: string;
    group?: string;
  }
@Injectable()
export class PermissionService {
    public async index():  Promise<permissionInterface[]> {
        let listPermissions = await fs.readFileSync(`src/database/data/permission.json`, 'utf-8')

        return JSON.parse(listPermissions)
    }
}
