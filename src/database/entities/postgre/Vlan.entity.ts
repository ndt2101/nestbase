import { BaseEntity, JoinColumn, JoinTable } from 'typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Zone } from './Zone.entity'; // Import Zone entity if it's defined in a separate file
import { ZoneSite } from './ZoneSite.entity';
import { Firewall } from './Firewall.entity';
import { Loadbalancer } from './Loadbalancer.entity';
import { InfrastructureType } from './InfrastructureType.entity';

@Entity('vlan')
export class Vlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vlan_id: number;

  @Column()
  vlan_name: string;

  @Column()
  subnet: string;

  @Column()
  gw: string;

  @Column()
  vxlan_id: string;

  @Column()
  vlan_id_l3: string;

  @Column()
  vxlan_id_l3: string;

  @Column()
  vrf: string;

  @Column()
  zone_uu_id: number;

  @Column()
  zone_site_id: number;

  @Column()
  infrastructure_type_id: number;

  @Column()
  ip_type: string;

  @Column()
  range_ip: string;

  @Column()
  system: string;

  @Column()
  purpose: string;

  @Column()
  ip_status: string;

  @Column()
  description: string;

  @ManyToOne(() => Zone, (zone) => zone.vlans)
  @JoinColumn({ name: 'zone_uu_id' })
  zone: Zone;

  @ManyToOne(() => ZoneSite, (zone_site) => zone_site.vlans)
  @JoinColumn({ name: 'zone_site_id' })
  zoneSite: ZoneSite;

  @ManyToOne(
    () => InfrastructureType,
    (infrastructureType) => infrastructureType.vlans,
  )
  @JoinColumn({ name: 'infrastructure_type_id' })
  infrastructureType: InfrastructureType;

  @ManyToMany(() => Firewall)
  @JoinTable({
    name: 'vlan_dcim_firewall',
    joinColumn: {
      name: 'vlan_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'firewall_id',
      referencedColumnName: 'id',
    },
  })
  firewalls: Firewall[];

  @ManyToMany(() => Loadbalancer, (loadBalancer) => loadBalancer.vlans)
  @JoinTable({
    name: 'vlan_dcim_loadbalancer',
    joinColumn: {
      name: 'vlan_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'loadbalancer_id',
      referencedColumnName: 'id',
    },
  })
  loadBalancers: Loadbalancer[];
}
