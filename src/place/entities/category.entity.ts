import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Place } from './place.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Column({ nullable: true })
  coverImg: string;

  @Field(() => String)
  @IsString()
  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Place, (place) => place.categories)
  places: Place[];
}
