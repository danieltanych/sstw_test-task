import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Guard для перевірки Bearer токену в заголовку Authorization
 */
@Injectable()
export class AuthGuard implements CanActivate {
  // Хардкод токен для аутентифікації
  private readonly validToken = 'sstw-secret-token-2024-nestjs-api';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization type. Use Bearer');
    }

    if (!token || token !== this.validToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
