import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaceInput, CreatePlaceOutput } from './dto/create-place.dto';
import { Place } from './entities/place.entity';
import { Location } from './entities/location.entity';
import {
  SearchNearPlacesInput,
  SearchNearPlacesOutput,
} from './dto/all-near-places.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place) private readonly places: Repository<Place>,
    @InjectRepository(Location)
    private readonly locations: Repository<Location>,
  ) {}
  async createPlace({
    points,
    ...values
  }: CreatePlaceInput): Promise<CreatePlaceOutput> {
    try {
      const place = await this.places.save(this.places.create(values));
      const locations = [];
      for (const point of points) {
        const newLocation = await this.locations.save(
          this.locations.create({
            place,
            point,
          }),
        );
        locations.push(newLocation);
      }
      place.locations = locations;
      await this.places.save(place);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
  async searchNearPlaces({
    lat,
    lng,
  }: SearchNearPlacesInput): Promise<SearchNearPlacesOutput> {
    try {
      const nearestLocation = await this.locations
        .createQueryBuilder('location')
        .loadAllRelationIds({
          relations: ['place'],
        })
        .orderBy('ST_Distance(point, ST_GeomFromGeoJSON(:origin))', 'ASC')
        .setParameters({
          origin: JSON.stringify({
            type: 'Point',
            coordinates: [lat, lng],
          }),
        })
        .getMany();

      const placesIds = new Set<string>();
      for (const location of nearestLocation) {
        placesIds.add(location.placeId);
      }
      const placesIdsArray = Array.from(placesIds);
      const places = await this.places
        .createQueryBuilder('place')
        .leftJoinAndSelect('place.locations', 'locations')
        .where('place.id IN (:...ids)', { ids: placesIdsArray })
        .getMany();
      return {
        ok: true,
        places: places.sort(
          (a, b) => placesIdsArray.indexOf(a.id) - placesIdsArray.indexOf(b.id),
        ),
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
