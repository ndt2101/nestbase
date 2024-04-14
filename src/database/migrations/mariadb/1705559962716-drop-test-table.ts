import { MigrationInterface, QueryRunner } from "typeorm"

export class DropTestTable1705559962716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('test')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('test')
    }
}
