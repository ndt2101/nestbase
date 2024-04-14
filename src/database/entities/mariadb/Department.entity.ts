import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity('departments')
export class Department extends BaseEntity {
    // List columns
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    fullname: string

    @Column()
    parent_id: number

    @Column()
    organization_id: number

    @Column()
    topdown_route: string

    @Column()
    topdown_level: string

    @Column()
    manager_id: number

    @Column()
    user_count: number

    @Column()
    recursive_user_count: number

    @Column()
    sub_department_count: number

    @Column()
    recursive_sub_department_count: number

    @CreateDateColumn({
        default: `now()`,
        nullable: true,
    })
    created_at: Date

    @UpdateDateColumn({
        default: `now()`,
        nullable: true,
    })
    updated_at: Date

    // Relations
    @OneToMany(() => User, (user) => user.department)
    @JoinColumn({ name: 'id' })
    users?: User[]
}