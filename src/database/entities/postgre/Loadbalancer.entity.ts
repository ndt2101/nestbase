import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { Device } from 'src/database/entities/postgre/Device.entity';

@Entity('dcim_loadbalancer')
export class Loadbalancer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    created: Date;

    @Column({ type: 'timestamp with time zone' })
    last_updated: Date;

    @Column({ length: 255 })
    system: string;

    @Column({ length: 255 })
    code: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'smallint' })
    lb_type: number;

    @Column({ length: 255 })
    firmware_version: string;

    @Column({ length: 255 })
    cloud_lb_uuid: string;

    @Column({ nullable: true })
    cloud_id: number;

    @Column()
    manager_id: number;

    @Column()
    site_id: number;

    @Column({ nullable: true })
    tenant_id: number;

    @Column({ length: 500, nullable: true })
    error_msg: string;

    @Column({ type: 'smallint', nullable: true })
    verify_status: number;

    @Column({ type: 'text' })
    comments: string;

    @Column()
    is_discovered: boolean;

    @OneToMany(() => Device, (device) => device.loadbalancer)
    devices: Device[];

    @ManyToMany(() => Vlan)
    @JoinTable()
    vlans: Vlan[]
}
