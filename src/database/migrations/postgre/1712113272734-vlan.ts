import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateVlanWithRelationship1712113272734 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "vlan",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "vlan_id", type: "int", isNullable: true },
                { name: "vlan_name", type: "varchar", isNullable: true },
                { name: "subnet", type: "varchar", isNullable: true },
                { name: "gw", type: "varchar", isNullable: true },
                { name: "vxlan_id", type: "varchar", isNullable: true },
                { name: "vlan_id_l3", type: "varchar", isNullable: true },
                { name: "vxlan_id_l3", type: "varchar", isNullable: true },
                { name: "vrf", type: "varchar", isNullable: true },
                { name: "zone_uu_id", type: "int", isNullable: true },
                { name: "zone_site_id", type: "int", isNullable: true },
                { name: "infrastructure_type_id", type: "int", isNullable: true },
                { name: "ip_type", type: "varchar", isNullable: true },
                { name: "range_ip", type: "varchar", isNullable: true },
                { name: "system", type: "varchar", isNullable: true },
                { name: "ip_status", type: "varchar", isNullable: true },
                { name: "purpose", type: "varchar", isNullable: true },
                { name: "description", type: "text", isNullable: true },
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
        await queryRunner.dropTable("vlan");
    }

}
