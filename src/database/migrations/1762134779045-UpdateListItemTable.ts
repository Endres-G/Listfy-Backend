import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateListItemTable1762134779045 implements MigrationInterface {
    name = 'UpdateListItemTable1762134779045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "FK_ba2ce0b37c7ab7af16a0eb6783f"`);
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "FK_3110a1e4c2c6eb8c4bd7a85ab47"`);
        await queryRunner.query(`ALTER TABLE "list_item" DROP COLUMN "assignedAt"`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "list_item" ALTER COLUMN "listId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "FK_89a46892e58c831d817b2dca8f7" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "FK_b31bfe011a0b21a907ae756782f" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "FK_b31bfe011a0b21a907ae756782f"`);
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "FK_89a46892e58c831d817b2dca8f7"`);
        await queryRunner.query(`ALTER TABLE "list_item" ALTER COLUMN "listId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_item" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD "assignedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "FK_3110a1e4c2c6eb8c4bd7a85ab47" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "FK_ba2ce0b37c7ab7af16a0eb6783f" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
