import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePodTable1710143554651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "pods",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "infrastructure_type_id",
                        isNullable: true,
                        type: "int",
                    },
                    {
                        name: "region_name",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "site_name",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('pods')
    }
}
