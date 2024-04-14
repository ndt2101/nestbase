import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Device } from './Device.entity';

@Entity('ipam_ipaddress')
export class IpamIpAddress extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  status: string;

  @Column()
  dns_name: string;

  // Relationship
  @OneToMany(() => Device, (device) => device.ip_address)
  devices: Device[];
}
