import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListAndUserTables1759077432893 implements MigrationInterface {
  name = 'ListAndUserTables1759077432893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===== USERS =====
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz
      )
    `);

    // ===== LISTS =====
    await queryRunner.query(`
      CREATE TABLE "list" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "description" varchar,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz,
        "ownerId" int
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "list"
      ADD CONSTRAINT "FK_list_owner"
      FOREIGN KEY ("ownerId") REFERENCES "user"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // ===== LIST ITEMS =====
    await queryRunner.query(`
      CREATE TABLE "list_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "list_id" int NOT NULL,
        "title" varchar NOT NULL,
        "done" boolean NOT NULL DEFAULT false,
        "assignee_id" int NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_list_items_list_id" ON "list_items" ("list_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_list_items_assignee_id" ON "list_items" ("assignee_id")`,
    );

    await queryRunner.query(`
      ALTER TABLE "list_items"
      ADD CONSTRAINT "FK_list_items_list"
      FOREIGN KEY ("list_id") REFERENCES "list"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "list_items"
      ADD CONSTRAINT "FK_list_items_assignee"
      FOREIGN KEY ("assignee_id") REFERENCES "user"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ===== DROP list_items =====
    await queryRunner.query(
      `ALTER TABLE "list_items" DROP CONSTRAINT "FK_list_items_assignee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_items" DROP CONSTRAINT "FK_list_items_list"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_list_items_assignee_id"`);
    await queryRunner.query(`DROP INDEX "IDX_list_items_list_id"`);
    await queryRunner.query(`DROP TABLE "list_items"`);

    // ===== DROP lists / users =====
    await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "FK_list_owner"`);
    await queryRunner.query(`DROP TABLE "list"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
