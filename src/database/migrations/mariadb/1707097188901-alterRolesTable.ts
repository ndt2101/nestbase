import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterRolesTable1707097188901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('roles', 'type')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "roles",
            new TableColumn({
                name: "type",
                type: "varchar",
                isNullable: true
            }),
        )
    }

}
