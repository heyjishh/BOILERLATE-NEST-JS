import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

import { Roles } from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (roles.length === 0 || !Array.isArray(roles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles.includes(user.role)) return false;

    return true;
  }
}
