import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Zone } from './Zone.entity';

@Entity('zone_attt')
export class ZoneATTT extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  zone_group: string;

  @Column()
  security_level: number;

  @Column()
  description: string;

  @OneToMany(() => Zone, (zone) => zone.zoneATTT)
  zones: Zone[];
}
