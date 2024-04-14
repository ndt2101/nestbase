import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Infrastructure } from 'src/database/entities/postgre/Infrastructure.entity';

@CustomRepository(Infrastructure)
export class InfrastructureRepository extends Repository<Infrastructure> {}