import { MigrationInterface, QueryRunner } from "typeorm";

export class StatusMetrics1792010000000 implements MigrationInterface {
    name = "StatusMetrics1792010000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "status_metrics" ("id" bigint NOT NULL, "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL, "api_ms" double precision NOT NULL, CONSTRAINT "PK_status_metrics" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_status_metric_recorded_at" ON "status_metrics" ("recorded_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_status_metric_recorded_at"`);
        await queryRunner.query(`DROP TABLE "status_metrics"`);
    }
}
