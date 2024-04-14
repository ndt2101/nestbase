import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { ZoneSite } from 'src/database/entities/postgre/ZoneSite.entity';
import { Repository } from 'typeorm';

@CustomRepository(ZoneSite)
export class ZoneSiteRepository extends Repository<ZoneSite> {}
