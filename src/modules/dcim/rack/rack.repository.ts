import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Rack } from 'src/database/entities/postgre/Rack.entity';
import { Repository } from 'typeorm';

@CustomRepository(Rack)
export class RackRepository extends Repository<Rack> {}
