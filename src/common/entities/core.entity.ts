import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

@ObjectType()
@InputType('TagInput')
export class Tag {
  @Field()
  @Column()
  name: string;
  @Field()
  @Column()
  value: string;
}

@ObjectType()
export class CoreEntity {
  @Field(() => String)
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string = v4();

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Tag], { nullable: true })
  @Column({ type: 'json', nullable: true })
  tags?: [Tag];
}
