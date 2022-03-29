import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LogInInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LogInOutput extends CoreOutput {
  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  token?: string;
}
