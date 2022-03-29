import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  SearchNearPlacesInput,
  SearchNearPlacesOutput,
} from './dto/all-near-places.dto';
import { CreatePlaceOutput, CreatePlaceInput } from './dto/create-place.dto';
import { Place } from './entities/place.entity';
import { PlacesService } from './places.service';

@Resolver(() => Place)
export class PlacesResolver {
  constructor(private readonly placesService: PlacesService) {}

  @Mutation(() => CreatePlaceOutput)
  async createPlace(
    @Args('input') createPlaceInput: CreatePlaceInput,
  ): Promise<CreatePlaceOutput> {
    return this.placesService.createPlace(createPlaceInput);
  }

  @Query(() => [SearchNearPlacesOutput])
  async searchNearPlaces(
    @Args('input') searchNearPlacesInput: SearchNearPlacesInput,
  ): Promise<SearchNearPlacesOutput> {
    return this.placesService.searchNearPlaces(searchNearPlacesInput);
  }
}
