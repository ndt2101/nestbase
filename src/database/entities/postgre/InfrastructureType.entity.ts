import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Infrastructure } from './Infrastructure.entity';
import { Pod } from './Pod.entity';
import { Zone } from './Zone.entity';
import { Vlan } from './Vlan.entity';

@Entity('infrastructure_types')
export class InfrastructureType extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({
    default: `now()`,
    nullable: true,
  })
  created_at: Date;

  @UpdateDateColumn({
    default: `now()`,
    nullable: true,
  })
  updated_at: Date;

  // Relationship
  @OneToMany(
    () => Infrastructure,
    (infrastructure) => infrastructure.infrastructureType,
  )
  infrastructures: Infrastructure[];

  @OneToMany(() => Pod, (pod) => pod.infrastructureType)
  pods: Pod[];

  @OneToMany(() => Zone, (zone) => zone.infrastructureType)
  zones: Zone[];

  @OneToMany(() => Vlan, (vlan) => vlan.infrastructureType)
  vlans: Vlan[];
}
