import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Site } from './Site.entity';
import { Pod } from './Pod.entity';
import { Device } from './Device.entity';
import { Rack } from './Rack.entity';

@Entity('dcim_location')
export class Location extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  site_id: number;

  @Column()
  pod_id: number;

  // Relationship
  @ManyToOne(() => Site, (site) => site.locations)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => Pod, (pod) => pod.locations)
  @JoinColumn({ name: 'pod_id' })
  pod: Pod;

  @OneToMany(() => Device, (device) => device.location)
  devices: Device[];

  @OneToMany(() => Rack, (rack) => rack.location)
  racks: Rack[];
}
