import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
