import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Rack } from './Rack.entity';
import { Region } from './Region.entity';
import { Location } from './Location.entity';
import { Device } from './Device.entity';

@Entity('dcim_site')
export class Site extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  region_id: number;

  // Relationship
  @OneToMany(() => Rack, (rack) => rack.site)
  racks: Rack[];

  @OneToMany(() => Device, (device) => device.site)
  devices: Device[];

  @OneToMany(() => Location, (location) => location.site)
  locations: Location[];

  @ManyToOne(() => Region, (region) => region.sites)
  @JoinColumn({ name: 'region_id' })
  region: Region;
}
