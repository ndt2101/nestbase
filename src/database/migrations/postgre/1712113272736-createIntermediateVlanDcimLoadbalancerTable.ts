import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateIntermediateVlanDcimLoadbalancerTable1712113272736 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "vlan_dcim_loadbalancer",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isPrimary: true,
                    },
                    {
                        name: "vlan_id",
                        type: "int",
                    },
                    {
                        name: "loadbalancer_id",
                        type: "int",
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
        await queryRunner.dropTable('vlan_dcim_loadbalancer')
    }

}
