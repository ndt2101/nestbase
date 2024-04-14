import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from 'src/common/decorators/permission.decorator';
import { getUserTokenByRequest } from './guard.helper';
import { PermissionEnum } from '@common/enums/permisison.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<PermissionEnum>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.is_administrator) {
      return true;
    }
    const roles = user.roles;

    const isValid = roles.some((role) => {
      if (role.role_permissions) {
        return role.role_permissions.some((permission) =>
          requiredPermissions.includes(permission.name),
        );
      } else {
        return false;
      }
    });

    return isValid;
  }
}
