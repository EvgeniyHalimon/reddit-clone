import {MigrationInterface, QueryRunner} from "typeorm";

export class createUsersTable1644401082115 implements MigrationInterface {
    name = 'createUsersTable1644401082115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3c3ab3f49a87e6ddb607f3c494" ON "Users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffc81a3b97dcbf8e320d5106c0" ON "Users" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ffc81a3b97dcbf8e320d5106c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c3ab3f49a87e6ddb607f3c494"`);
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
