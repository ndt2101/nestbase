import { PermissionGuard } from '@guards/permission.guard';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export function Permissions(...permissions: string[]) {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    UseGuards(PermissionGuard),
  );
}
