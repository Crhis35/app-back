import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Place } from './entities/place.entity';
import { PlacesResolver } from './places.resolver';
import { PlacesService } from './places.service';

@Module({
  imports: [TypeOrmModule.forFeature([Place, Location])],
  providers: [PlacesResolver, PlacesService],
})
export class PlacesModule {}
