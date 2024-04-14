import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPodIdIntoInfrastructureTable1711528978689 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "infrastructures",
            new TableColumn({
                name: "pod_id",
                type: "int",
                isNullable: true
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('infrastructures', 'pod_id')
    }

}
