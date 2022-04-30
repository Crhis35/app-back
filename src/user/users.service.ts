import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-user.input';
import { LogInInput, LogInOutput } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
  ) {}
  async validateUser({ email, password }: LogInInput): Promise<LogInOutput> {
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });

      if (!user) {
        return { ok: false, error: 'No user with that email' };
      }
      const isValid = await user.checkPassword(password);

      if (!isValid) {
        return { ok: false, error: 'Incorrect password' };
      }
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'Could not validate user' };
    }
  }
  async createAccount({
    email,
    password,
    role,
    username,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role, username }),
      );
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      // this.mailService.sendVerificationEmail(user.email, verification.code);
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'Could not create a user' };
    }
  }
  async me(id: string) {
    try {
      const user = await this.users.findOne({
        where: { id },
        select: ['id', 'email', 'role'],
      });
      return { ok: true, user };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find the user',
      };
    }
  }
}
