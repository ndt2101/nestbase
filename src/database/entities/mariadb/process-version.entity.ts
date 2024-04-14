import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Process } from "./process.entity"

@Entity('process_versions')
export class ProcessVersion {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    @Index('process_id_index')
    process_id : number

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
    @Index('version_created_by_index')
    version_created_by : number

    @Column({
        type: 'int',
    })
    number : number

    @Column({
        type: 'varchar',
        length: 255,
    })
    code : string

    @Column({
        type: 'varchar',
        length: 255,
    })
    name : string

    @Column({
        type: 'text',
        nullable: true,
    })
    description : string

    @Column({
        type: 'longtext',
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

    @ManyToOne(() => Process, process => process.processVersions)
    @JoinColumn({
        name: 'process_id',
        referencedColumnName: 'id',
    })
    process : Process
}
