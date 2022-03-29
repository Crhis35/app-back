import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from 'src/user/dto/create-user.input';
import { LogInInput, LogInOutput } from 'src/user/dto/login.dto';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(logInInput: LogInInput): Promise<LogInOutput> {
    return this.usersService.validateUser(logInInput);
  }
  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const { ok, user } = await this.usersService.createAccount(
        createAccountInput,
      );
      if (!ok) {
        return {
          ok: false,
          error: 'Could not create account',
        };
      }
      const payload = { username: user.email, sub: user.id };
      return {
        ok,
        token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
  async login(logInInput: LogInInput): Promise<LogInOutput> {
    try {
      const { ok, user } = await this.validateUser(logInInput);
      const payload = { username: user.email, sub: user.id };
      if (!ok) {
        return {
          ok: false,
          error: 'Could not login',
        };
      }
      return {
        ok,
        token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not login',
      };
    }
  }
}
