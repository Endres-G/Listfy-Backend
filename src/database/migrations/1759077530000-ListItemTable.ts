import { MigrationInterface, QueryRunner } from "typeorm";

export class ListItemTable1759077530000 implements MigrationInterface {
    name = 'ListItemTable1759077530000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "list_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "assignedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "listId" integer NOT NULL, "assignedToId" integer, CONSTRAINT "PK_51f12d35f5ecf801e1665f2b09c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "FK_3110a1e4c2c6eb8c4bd7a85ab47" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "FK_ba2ce0b37c7ab7af16a0eb6783f" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "FK_ba2ce0b37c7ab7af16a0eb6783f"`);
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "FK_3110a1e4c2c6eb8c4bd7a85ab47"`);
        await queryRunner.query(`DROP TABLE "list_item"`);
    }

}
