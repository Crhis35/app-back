import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
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
}
