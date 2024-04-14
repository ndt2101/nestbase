import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProcessVersionsTable1705543492516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'process_versions',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'process_id',
                    type: 'int',
                    unsigned: true,
                    isNullable: false,
                },
                {
                    name: 'process_category_id',
                    unsigned: true,
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'version_created_by', // user_id
                    unsigned: true,
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'number',
                    unsigned: true,
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
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
            ],
        }), true)
        await queryRunner.query(`CREATE INDEX process_id_index ON process_versions(process_id)`)
        await queryRunner.query(`CREATE INDEX process_category_id_index ON process_versions(process_category_id)`)
        await queryRunner.query(`CREATE INDEX version_created_by_index ON process_versions(version_created_by)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('process_versions', true)
    }
}
