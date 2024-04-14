import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPodIdIntoDcimLocationTable1710408296435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "dcim_location",
            new TableColumn({
                name: "pod_id",
                type: "int",
                isNullable: true
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('dcim_location', 'pod_id')
    }

}
