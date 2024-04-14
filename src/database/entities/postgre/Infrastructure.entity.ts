import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { InfrastructureType } from './InfrastructureType.entity';
import { Pod } from './Pod.entity';
import { FileUpload } from './FileUpload.entity';

@Entity('infrastructures')
export class Infrastructure extends BaseEntity {
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

  @Column({
    type: 'int',
    nullable: true,
  })
  pod_id: number;

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
  @ManyToOne(
    () => InfrastructureType,
    (infrastructureType) => infrastructureType.infrastructures,
  )
  @JoinColumn({ name: 'infrastructure_type_id' })
  infrastructureType: InfrastructureType;

  @ManyToOne(() => Pod, (pod) => pod.infrastructures)
  @JoinColumn({ name: 'pod_id' })
  pod: Pod;

  @OneToMany(() => FileUpload, (hldFile) => hldFile.infrastructure)
  hldFiles: FileUpload[];
}
