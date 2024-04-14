import { BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Vlan } from './Vlan.entity';
import { Firewall } from './Firewall.entity';

@Entity('vlan_dcim_firewall')
export class VlanFirewall extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vlan_id: number;

  @Column()
  firewall_id: number;

  @ManyToOne(() => Vlan)
  @JoinColumn({ name: 'vlan_id' })
  vlan: Vlan;

  @ManyToOne(() => Firewall)
  @JoinColumn({ name: 'firewall_id' })
  firewall: Firewall;
}
