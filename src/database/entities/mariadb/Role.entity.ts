import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { RolePermission } from "./RolePermission.entity"
import { User } from "./User.entity"

@Entity('roles')
export class Role extends BaseEntity {
    // List columns
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

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
    @OneToMany(() => RolePermission, (role_permission) => role_permission.role)
    @JoinColumn({ name: 'id' })
    role_permissions: RolePermission[]

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
