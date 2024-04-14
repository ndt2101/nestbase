import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Pod } from './Pod.entity';
import { Site } from './Site.entity';
import { Device } from './Device.entity';
import { Location } from './Location.entity';

@Entity('dcim_rack')
export class Rack extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pod_id: number;

  @Column()
  facility_id: number;

  @Column()
  u_height: number;

  @Column()
  location_id: number;

  @Column()
  site_id: number;

  @Column()
  tenant_id: number;

  @Column()
  width: number;

  @Column()
  role_id: number;

  @Column()
  desc_units: boolean;

  @Column()
  serial: string;

  @Column()
  status: string;

  @Column()
  asset_tag: string;

  @Column()
  outer_depth: number;

  @Column()
  outer_width: number;

  @Column()
  _name: string;

  @Column()
  custom_field_data: string;

  @Column()
  type: string;

  @Column()
  comments: string;

  // Relationship
  @ManyToOne(() => Pod, (pod) => pod.racks)
  @JoinColumn({ name: 'pod_id' })
  pod: Pod;

  @ManyToOne(() => Site, (site) => site.racks)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => Location, (location) => location.racks)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @OneToMany(() => Device, (device) => device.rack)
  devices: Device[];
}
