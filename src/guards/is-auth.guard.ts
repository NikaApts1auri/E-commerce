import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let token = request.cookies['token'];

    if (!token && request.headers['authorization']) {
      token = this.getToken(request.headers);
    }

    if (!token) throw new UnauthorizedException('Permission denied');

    try {
      const payload = await this.jwtService.verify(token);
      request.user = { id: payload.id, role: payload.role };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Permission denied');
    }
  }

  private getToken(headers: any) {
    const authHeader = headers['authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
