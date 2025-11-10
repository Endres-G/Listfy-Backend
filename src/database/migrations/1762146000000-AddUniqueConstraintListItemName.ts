import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintListItemName1762146000000 implements MigrationInterface {
    name = 'AddUniqueConstraintListItemName1762146000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "UQ_list_item_name_list" UNIQUE ("name", "listId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "UQ_list_item_name_list"`);
    }

}
