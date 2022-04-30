import { UseGuards } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User, @Info() info: GraphQLResolveInfo) {
    // return this.usersService.me(user.id);
    console.log(user);
    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    console.log(parsedInfo);
    const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType,
    );
    console.log(simplifiedInfo);
    return user;
  }
}
