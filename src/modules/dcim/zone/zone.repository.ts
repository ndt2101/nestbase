import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { Repository } from 'typeorm';

@CustomRepository(Zone)
export class ZoneRepository extends Repository<Zone> {}
