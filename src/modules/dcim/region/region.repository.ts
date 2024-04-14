import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Region } from 'src/database/entities/postgre/Region.entity';

@CustomRepository(Region)
export class RegionRepository extends Repository<Region> {}
