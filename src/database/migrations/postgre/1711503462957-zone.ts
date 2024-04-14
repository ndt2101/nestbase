import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Zone1711503462957 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "zone",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "zone_id", type: "int", isNullable: true },
                { name: "name", type: "varchar", isNullable: true },
                { name: "zone_attt_id", type: "int", isNullable: true },
                { name: "infrastructure_type_id", type: "int", isNullable: true },
                { name: "description", type: "text", isNullable: true },
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
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("zone");
    }

}
