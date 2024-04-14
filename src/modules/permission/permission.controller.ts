import { Controller, Get } from '@nestjs/common';
import { PermissionService, permissionInterface } from './permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}
    @Get('/')
    index(): Promise<permissionInterface[]> {
        return this.permissionService.index()
    }
}
