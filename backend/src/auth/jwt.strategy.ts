import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'ferha-dev-secret',
    });
  }

  async validate(payload: { userId: string; role: string }) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new UnauthorizedException();
    return { userId: user.id, role: user.role, email: user.email };
  }
}
