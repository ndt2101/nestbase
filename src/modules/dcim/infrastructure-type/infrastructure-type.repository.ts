import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { InfrastructureType } from 'src/database/entities/postgre/InfrastructureType.entity';

@CustomRepository(InfrastructureType)
export class InfrastructureTypeRepository extends Repository<InfrastructureType> {}