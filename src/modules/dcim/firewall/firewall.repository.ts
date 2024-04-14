import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { Repository } from 'typeorm';

@CustomRepository(Firewall)
export class FirewallRepository extends Repository<Firewall> {}
