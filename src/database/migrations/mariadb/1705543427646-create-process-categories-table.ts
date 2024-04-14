import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProcessCategoriesTable1705543427646 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'process_categories',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                    isNullable: false,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('process_categories', true)
    }
}
