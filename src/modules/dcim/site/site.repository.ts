import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Site } from 'src/database/entities/postgre/Site.entity';

@CustomRepository(Site)
export class SiteRepository extends Repository<Site> {}
