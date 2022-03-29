import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { PaginationOutput } from 'src/common/dto/pagination.dto';
import { Place } from '../entities/place.entity';

@InputType()
export class SearchNearPlacesInput {
  @Field(() => Float)
  lat: number;
  @Field(() => Float)
  lng: number;
}

@ObjectType()
export class SearchNearPlacesOutput extends PaginationOutput {
  @Field(() => [Place])
  places?: Place[];
}
