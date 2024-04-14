import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { ZoneATTT } from 'src/database/entities/postgre/ZoneATTT.entity';
import { Repository } from 'typeorm';

@CustomRepository(ZoneATTT)
export class ZoneATTTRepository extends Repository<ZoneATTT> {}
