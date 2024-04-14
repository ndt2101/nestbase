import { Device } from 'src/database/entities/postgre/Device.entity';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('dcim_firewall')
export class Firewall extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  created: Date;

  @Column({ type: 'timestamp with time zone' })
  last_updated: Date;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'smallint' })
  type: number;

  @Column({ length: 50 })
  slug: string;

  @Column()
  manager_id: number;

  @Column({ nullable: true })
  system_id: number;

  @Column({ nullable: true })
  vip_id: number;

  @Column({ length: 500, nullable: true })
  error_msg: string;

  @Column({ type: 'smallint', nullable: true })
  verify_status: number;

  @Column()
  firewall_controller_id: number;

  @OneToMany(() => Device, (device) => device.firewall)
  devices: Device[];

  @ManyToMany(() => Vlan)
  @JoinTable({
    name: 'vlan_dcim_firewall',
    joinColumn: {
      name: 'firewall_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'vlan_id',
      referencedColumnName: 'id',
    },
  })
  vlans: Vlan[];
}
