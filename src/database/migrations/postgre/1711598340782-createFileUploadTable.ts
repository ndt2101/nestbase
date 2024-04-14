import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFileUploadTable1711598340782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "file_uploads",
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
                        name: "formated_name",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "extension",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "mimetype",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "driver",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "path",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "url",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "size",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "folder_name",
                        isNullable: true,
                        type: "varchar",
                    },
                    {
                        name: "entity_id",
                        isNullable: true,
                        type: "int",
                    },
                    {
                        name: "entity_type",
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
        await queryRunner.dropTable('file_uploads')
    }

}
