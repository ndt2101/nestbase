import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Site } from './Site.entity';

@Entity('dcim_region')
export class Region extends BaseEntity {
  // List columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  parent_id: number;

  // Relationship
  @OneToMany(() => Site, (site) => site.region)
  sites: Site[];
}
