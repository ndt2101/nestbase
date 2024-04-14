import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { InfrastructureType } from './InfrastructureType.entity';
import { Vlan } from './Vlan.entity';
import { ZoneATTT } from './ZoneATTT.entity';
@Entity('zone')
export class Zone extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  zone_id: number;

  @Column()
  zone_attt_id: number;

  @Column()
  infrastructure_type_id: number;

  @Column()
  description: string;

  @ManyToOne(
    () => InfrastructureType,
    (infrastructureType) => infrastructureType.zones,
  )
  @JoinColumn({ name: 'infrastructure_type_id' })
  infrastructureType: InfrastructureType;

  @OneToMany(() => Vlan, (vlan) => vlan.zone_uu_id)
  vlans: Vlan[];

  @ManyToOne(() => ZoneATTT, (zoneATTT) => zoneATTT.zones)
  @JoinColumn({ name: 'zone_attt_id' })
  zoneATTT: ZoneATTT;
}
