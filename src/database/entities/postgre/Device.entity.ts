import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { Loadbalancer } from 'src/database/entities/postgre/Loadbalancer.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Site } from './Site.entity';
import { Location } from './Location.entity';
import { Rack } from './Rack.entity';
import { IpamIpAddress } from './IpamIpaddress.entity';

@Entity('dcim_device')
export class Device extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  serial: string;

  @Column()
  position: number;

  @Column()
  face: string;

  @Column()
  status: string;

  @Column()
  device_role_id: number;

  @Column()
  device_type_id: number;

  @Column()
  platform_id: number;

  @Column()
  rack_id: number;

  @Column()
  primary_ip4_id: number;

  @Column()
  primary_ip6_id: number;

  @Column()
  tenant_id: number;

  @Column()
  site_id: number;

  @Column()
  manager_id: number;

  @Column()
  load_balancer_id: number;

  @Column()
  firewall_id: number;

  @Column()
  vpn_id: number;

  @Column()
  storage_id: number;

  @Column()
  switch_id: number;

  @Column()
  location_id: number;

  @Column()
  san_switch_id: number;

  @Column()
  custom_field_data: string;

  // Relationship
  @ManyToOne(() => Location, (location) => location.devices)
  @JoinColumn({ name: 'location_id' })
  location: Location

  @ManyToOne(() => Site, (site) => site.devices)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => Rack, (rack) => rack.devices)
  @JoinColumn({ name: 'rack_id' })
  rack: Rack;

  @ManyToOne(() => IpamIpAddress, (ip_address) => ip_address.devices)
  @JoinColumn({ name: 'primary_ip4_id' })
  ip_address: IpamIpAddress;

  @ManyToOne(() => Loadbalancer, (lb) => lb.devices)
  @JoinColumn({ name: 'load_balancer_id' })
  loadbalancer: Loadbalancer;

  @ManyToOne(() => Firewall, (fw) => fw.devices)
  @JoinColumn({ name: 'firewall_id' })
  firewall: Firewall;
}
