import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Department } from "./Department.entity"
import { Role } from "./Role.entity"

@Entity('users')
export class User extends BaseEntity {
    // List columns
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    fullname: string

    @Column()
    email: string

    @Column()
    staff_code: string

    @Column()
    status: string

    @Column()
    is_administrator: boolean

    @Column()
    address: string

    @Column()
    city: string

    @Column()
    country: string

    @Column()
    phone: string

    @Column()
    birthday: Date

    @Column()
    timezone: string

    @Column()
    language: string

    @Column()
    gender: string

    @Column()
    positionName: string

    @Column()
    organizationName: string

    @Column()
    departmentName: string

    @Column()
    department_id: number

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
    @ManyToOne(() => Department, (department) => department.users)
    @JoinColumn({ name: 'department_id' })
    department: Department

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}
