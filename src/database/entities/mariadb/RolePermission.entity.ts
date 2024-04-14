import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./Role.entity";

@Entity('role_permission')
export class RolePermission extends BaseEntity {
    // List columns
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    role_id: number

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
    @ManyToOne(() => Role, (role) => role.role_permissions)
    @JoinColumn({ name: 'role_id' })
    role: Role
}