import { MigrationInterface, QueryRunner } from "typeorm";

export class AddListUserJoinTable1762821816278 implements MigrationInterface {
    name = 'AddListUserJoinTable1762821816278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "UQ_list_item_name_list"`);
        await queryRunner.query(`CREATE TABLE "list_users" ("listId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_52253155c9e947abed5414ca08d" PRIMARY KEY ("listId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_72f61085df56a065aa68bbdccd" ON "list_users" ("listId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f33318c2067b145cec32939f64" ON "list_users" ("userId") `);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "UQ_824d4095e8d9404b7803761a216" UNIQUE ("name", "listId")`);
        await queryRunner.query(`ALTER TABLE "list_users" ADD CONSTRAINT "FK_72f61085df56a065aa68bbdccd3" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "list_users" ADD CONSTRAINT "FK_f33318c2067b145cec32939f649" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_users" DROP CONSTRAINT "FK_f33318c2067b145cec32939f649"`);
        await queryRunner.query(`ALTER TABLE "list_users" DROP CONSTRAINT "FK_72f61085df56a065aa68bbdccd3"`);
        await queryRunner.query(`ALTER TABLE "list_item" DROP CONSTRAINT "UQ_824d4095e8d9404b7803761a216"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f33318c2067b145cec32939f64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72f61085df56a065aa68bbdccd"`);
        await queryRunner.query(`DROP TABLE "list_users"`);
        await queryRunner.query(`ALTER TABLE "list_item" ADD CONSTRAINT "UQ_list_item_name_list" UNIQUE ("name", "listId")`);
    }

}
