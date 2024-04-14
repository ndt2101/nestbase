import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rack } from './Rack.entity';
import { InfrastructureType } from './InfrastructureType.entity';
import { Location } from './Location.entity';
import { Infrastructure } from './Infrastructure.entity';

@Entity('pods')
export class Pod extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  infrastructure_type_id: number;

  @Column()
  region_name: string;

  @Column()
  site_name: string;

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

  // Relation
  @OneToMany(() => Rack, (rack) => rack.pod)
  racks: Rack[];

  @OneToMany(() => Location, (location) => location.pod)
  locations: Location[];

  @OneToMany(() => Infrastructure, (infrastructure) => infrastructure.pod)
  infrastructures: Infrastructure[];

  @ManyToOne(
    () => InfrastructureType,
    (infrastructureType) => infrastructureType.pods,
  )
  @JoinColumn({ name: 'infrastructure_type_id' })
  infrastructureType: InfrastructureType;
}
