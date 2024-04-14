import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('policy')
export class Policy extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    source_zone: string;

    @Column()
    destination_zone: string;

    @Column()
    action: string;

    @Column()
    protocol: string;

    @Column()
    description: string;
}
