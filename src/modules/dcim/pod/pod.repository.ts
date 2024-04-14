import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Pod } from 'src/database/entities/postgre/Pod.entity';
import { Repository } from 'typeorm';

@CustomRepository(Pod)
export class PodRepository extends Repository<Pod> {}
