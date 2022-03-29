import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field({ nullable: true })
  error?: string;

  @Field()
  ok?: boolean;
}
