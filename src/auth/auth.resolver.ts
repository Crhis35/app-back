import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from 'src/user/dto/create-user.input';
import { LogInInput, LogInOutput } from 'src/user/dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => CreateAccountOutput)
  async createUser(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.authService.createAccount(createAccountInput);
  }

  @Mutation(() => LogInOutput)
  async login(@Args('input') logInInput: LogInInput) {
    return this.authService.login(logInInput);
  }
}
