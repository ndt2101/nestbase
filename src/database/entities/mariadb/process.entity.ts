import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, In, OneToMany, JoinTable, ManyToOne, JoinColumn, OneToOne } from 'typeorm'

import { ProcessVersion } from './process-version.entity'
import { ProcessCategory } from './process-category.entity'

@Entity('processes')
export class Process {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int',
        nullable: true,
    })
    @Index('process_category_id_index')
    process_category_id : number

    @Column({
        type: 'int',
        nullable: true,
    })
    @Index('created_by_index')
    created_by : number

    @Column({
        type: 'int',
        nullable: true,
    })
    last_updated_by : number

    @Column({
        type: 'int',
        nullable: true,
    })
    deleted_by : number

    @Column({
        type: 'varchar',
        length: 255,
    })
    @Index({
        unique: true,
    })
    name : string

    @Column({
        type: 'text',
        nullable: true,
    })
    description : string

    @Column({
        type: 'longtext',
        nullable: true,
    })
    bpmn : string

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

    @DeleteDateColumn()
    deleted_at : Date

    @OneToMany(() => ProcessVersion, processVersion => processVersion.process, {
        eager: true,
        persistence: false,
    })
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'process_id',
    })
    processVersions? : ProcessVersion[]

    @ManyToOne(() => ProcessCategory, processCategory => processCategory.processes, {
        eager: true,
        nullable: true,
    })
    @JoinColumn({
        name: 'process_category_id',
        referencedColumnName: 'id',
    })
    processCategory : ProcessCategory
}
