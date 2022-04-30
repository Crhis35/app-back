import { InputType, ObjectType, PickType, Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(
  User,
  ['email', 'password', 'role', 'username'],
  InputType,
) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {
  @Field(() => User, {
    nullable: true,
  })
  user?: User;
  @Field(() => String, {
    nullable: true,
  })
  token?: string;
}
