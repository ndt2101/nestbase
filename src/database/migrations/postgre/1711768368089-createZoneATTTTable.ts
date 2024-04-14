import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateZoneATTTTable1711768368089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "zone_attt",
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
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "zone_group",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "security_level",
                        isNullable: true,
                        type: "int",
                    },
                    {
                        name: "description",
                        isNullable: true,
                        type: "text",
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
        await queryRunner.dropTable('zone_attt')
    }

}
