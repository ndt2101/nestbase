import { BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Vlan } from './Vlan.entity';
import { Loadbalancer } from './Loadbalancer.entity';

@Entity('vlan_dcim_loadbalancer')
export class VlanLoadbalancer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vlan_id: number;

  @Column()
  loadbalancer_id: number;

  @ManyToOne(() => Vlan)
  @JoinColumn({ name: 'vlan_id' })
  vlan: Vlan;

  @ManyToOne(() => Loadbalancer)
  @JoinColumn({ name: 'loadbalancer_id' })
  loadbalancer: Loadbalancer;
}
