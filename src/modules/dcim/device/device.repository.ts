import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { Repository } from 'typeorm';

@CustomRepository(Device)
export class DeviceRepository extends Repository<Device> {}
