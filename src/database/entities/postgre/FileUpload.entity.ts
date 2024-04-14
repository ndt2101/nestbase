import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Infrastructure } from './Infrastructure.entity';

@Entity('file_uploads')
export class FileUpload extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  formated_name: string;

  @Column()
  extension: string;

  @Column()
  mimetype: string;

  @Column()
  driver: string;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column()
  size: string;

  @Column()
  folder_name: string;

  @Column()
  entity_type: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  entity_id: number;

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

  @ManyToOne(() => Infrastructure, (infrastructure) => infrastructure.hldFiles)
  @JoinColumn({ name: 'entity_id' })
  infrastructure: Infrastructure;
}
