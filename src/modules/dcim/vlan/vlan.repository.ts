import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { Repository } from 'typeorm';

@CustomRepository(Vlan)
export class VlanRepository extends Repository<Vlan> {}
