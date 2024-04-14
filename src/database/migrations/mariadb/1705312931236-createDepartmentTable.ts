import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDepartmentTable1705312931236 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'departments',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'fullname',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'parent_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'organization_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'topdown_route',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'topdown_level',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'manager_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'user_count',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'recursive_user_count',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'sub_department_count',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'recursive_sub_department_count',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        default: 'now()',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('departments')
    }

}
