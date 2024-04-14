import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinColumn } from "typeorm"
import { Process } from "./process.entity"

@Entity('process_categories')
export class ProcessCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 255,
    })
    @Index({
        unique: true,
    })
    name : string

    @Column({
        type: 'enum',
        enum: [
            'ACTIVE',
            'INACTIVE',
        ],
        default: 'ACTIVE',
    })
    status : string

    @CreateDateColumn()
    created_at : Date

    @UpdateDateColumn()
    updated_at : Date

    @OneToMany(() => Process, process => process.processCategory, {
        persistence: false,
    })
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'process_category_id',
    })
    processes? : Process[]
}
