import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePlaceInput } from './create-place.dto';

@InputType()
export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {}
