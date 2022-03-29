import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Point, Position } from 'geojson';
import { Place } from './place.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@InputType('LPointInputType', { isAbstract: true })
@ObjectType()
export class LPoint implements Point {
  @Field()
  type: 'Point';

  @Field(() => [Number])
  @IsArray()
  coordinates: Position;
}

@InputType('LocationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Location extends CoreEntity {
  @Field(() => LPoint, {
    nullable: true,
  })
  @Index({
    spatial: true,
  })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  point: LPoint;

  @Field(() => Place)
  @ManyToOne(() => Place, (place) => place.locations)
  place: Place;

  @RelationId((location: Location) => location.place)
  placeId: string;
}
