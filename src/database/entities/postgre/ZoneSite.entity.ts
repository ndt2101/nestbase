import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Vlan } from './Vlan.entity';

@Entity('zone_site')
export class ZoneSite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Vlan, (vlan) => vlan.zoneSite)
  vlans: Vlan[];
}
