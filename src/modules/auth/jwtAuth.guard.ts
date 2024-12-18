import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { User } from "@/models/users.schema";

import { AuthService } from "./auth.service";
import { IJwtTokenPayload } from "./interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token: string = req.headers["authorization"]?.split(" ")[1];

    if (token) {
      try {
        const payload: IJwtTokenPayload = { jwt: token };
        const user: User = await this.authService.validateToken(payload);
        if (user) {
          req.user = user;
          return true;
        } else throw new UnauthorizedException();
      } catch (err) {
        throw new UnauthorizedException(err.message);
      }
    } else {
      const isOptional: boolean = this.reflector.get<boolean>(
        "optional-auth",
        context.getHandler(),
      );
      if (isOptional) {
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
