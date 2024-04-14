import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Loadbalancer } from 'src/database/entities/postgre/Loadbalancer.entity'; 

@CustomRepository(Loadbalancer)
export class LoadbalancerRepository extends Repository<Loadbalancer> {}
