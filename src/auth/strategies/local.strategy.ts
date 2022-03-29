import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LogInInput } from 'src/user/dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(logInInput: LogInInput) {
    const { ok, user } = await this.authService.validateUser(logInInput);
    if (!ok) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
