import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPodIdToRackTable1710143691846 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "dcim_rack",
            new TableColumn({
                name: "pod_id",
                type: "int",
                isNullable: true
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('dcim_rack', 'pod_id')
    }
}
