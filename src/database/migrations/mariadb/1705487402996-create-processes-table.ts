import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProcessesTable1705487402996 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'processes',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'process_category_id',
                    unsigned: true,
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'created_by', // user_id
                    unsigned: true,
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'last_updated_by', // user_id
                    unsigned: true,
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'deleted_by', // user_id
                    unsigned: true,
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'bpmn',
                    type: 'longtext',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: [
                        'ACTIVE',
                        'INACTIVE',
                    ],
                    isNullable: false,
                    default: "'ACTIVE'",
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }), true)
        await queryRunner.query(`CREATE INDEX process_category_id_index ON processes(process_category_id)`)
        await queryRunner.query(`CREATE INDEX created_by_index ON processes(created_by)`)
        await queryRunner.query(`CREATE INDEX last_updated_by_index ON processes(last_updated_by)`)
        await queryRunner.query(`CREATE INDEX deleted_by_index ON processes(deleted_by)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('processes', true)
    }
}
