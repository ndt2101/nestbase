import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Location } from 'src/database/entities/postgre/Location.entity';
import { Repository } from 'typeorm';

@CustomRepository(Location)
export class LocationRepository extends Repository<Location> {}
