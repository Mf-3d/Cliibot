import { sql, type Kysely } from "kysely";

import type { Database } from "../schema.js";

export async function up(db: Kysely<Database>) {
  // テーブル作成
  await db.schema
    .createTable("anniversary_notification_logs")
    .addColumn("anniversary_id", "text", (col) => col.notNull())
    .addColumn("year", "integer", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull().defaultTo("pending"))
    .addColumn("attempt_count", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint("anniversary_notification_logs_pkey", ["anniversary_id", "year"])
    .addCheckConstraint(
      "anniversary_notification_logs_status_check",
      sql`status IN ('pending', 'sent', 'failed')`
    )
    .addCheckConstraint(
      "anniversary_notification_logs_attempt_count_check",
      sql`attempt_count >= 0`
    )
    .execute();
}

export async function down(db: Kysely<Database>) {
  // テーブル削除
  await db.schema.dropTable("anniversary_notification_logs").ifExists().execute();
}

// export const migration: Migration = {
//   up: async (db: Kysely<Database>) => {
//     // テーブル作成
//     await db.schema
//       .createTable("anniversary_notification_logs")
//       .addColumn("anniversary_id", "text", (col) => col.notNull())
//       .addColumn("year", "integer", (col) => col.notNull())
//       .addColumn("status", "text", (col) => col.notNull().defaultTo("pending"))
//       .addColumn("attempt_count", "integer", (col) => col.notNull().defaultTo(0))
//       .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
//       .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
//       .addPrimaryKeyConstraint("anniversary_notification_logs_pkey", ["anniversary_id", "year"])
//       .addCheckConstraint(
//         "anniversary_notification_logs_status_check",
//         sql`status IN ('pending', 'sent', 'failed')`
//       )
//       .addCheckConstraint(
//         "anniversary_notification_logs_attempt_count_check",
//         sql`attempt_count >= 0`
//       )
//       .execute();
//   },

//   down: async (db: Kysely<Database>) => {
//     // テーブル削除
//     await db.schema.dropTable("anniversary_notification_logs").ifExists().execute();
//   },
// };
