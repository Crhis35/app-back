import { Test, TestingModule } from '@nestjs/testing';
import { PlacesResolver } from './places.resolver';

describe('PlacesResolver', () => {
  let resolver: PlacesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacesResolver],
    }).compile();

    resolver = module.get<PlacesResolver>(PlacesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
