import { InputType, ObjectType, PickType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { LPoint } from '../entities/location.entity';
import { Place } from '../entities/place.entity';

@InputType()
class LPointInput extends PickType(LPoint, ['coordinates'], InputType) {}

@InputType()
export class CreatePlaceInput extends PickType(Place, ['name', 'description']) {
  @Field(() => [LPointInput])
  @IsArray()
  points: [LPointInput];
}

@ObjectType()
export class CreatePlaceOutput extends CoreOutput {}
