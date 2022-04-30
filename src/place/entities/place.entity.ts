import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Location } from './location.entity';

@InputType('PlaceInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Place extends CoreEntity {
  @Field(() => [Location], {
    nullable: true,
  })
  @OneToMany(() => Location, (location) => location.place, {
    nullable: true,
  })
  locations: Location[];

  @Field()
  @Column()
  @IsString()
  name: string;

  @Field()
  @Column()
  @IsString()
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.places, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => Category, (category) => category.places, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  categories: Category[];
}
