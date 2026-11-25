import type { Insertable, Kysely, Selectable } from "kysely";
import type { AnniversaryNotificationLog } from "./model.js";
import type { Database } from "@/infrastructure/database/schema.js";

export interface AnniversaryNotificationLogRepositoryInterface {
  findByAnniversaryIdAndYear(
    anniversaryId: string,
    year: number
  ): Promise<AnniversaryNotificationLog | null>;

  create(anniversaryId: string, year: number): Promise<void>;

  incrementAttemptCount(anniversaryId: string, year: number): Promise<void>;

  updateStatus(anniversaryId: string, year: number, status: "sent" | "failed"): Promise<void>;

  toAnniversaryNotificationLog(
    record: Selectable<Database["anniversary_notification_logs"]>
  ): AnniversaryNotificationLog;

  toRecord(
    anniversaryNotificationLog: AnniversaryNotificationLog
  ): Insertable<Database["anniversary_notification_logs"]>;
}

export class AnniversaryNotificationLogRepository implements AnniversaryNotificationLogRepositoryInterface {
  constructor(private readonly db: Kysely<Database>) {}

  async findByAnniversaryIdAndYear(
    anniversaryId: string,
    year: number
  ): Promise<AnniversaryNotificationLog | null> {
    const record = await this.db
      .selectFrom("anniversary_notification_logs")
      .selectAll()
      .where("anniversary_id", "=", anniversaryId)
      .where("year", "=", year)
      .executeTakeFirst();

    if (!record) {
      return null;
    }

    return this.toAnniversaryNotificationLog(record);
  }

  async create(anniversaryId: string, year: number): Promise<void> {
    await this.db
      .insertInto("anniversary_notification_logs")
      .values({
        anniversary_id: anniversaryId,
        year,
      })
      .execute();
  }

  async incrementAttemptCount(anniversaryId: string, year: number): Promise<void> {
    await this.db
      .updateTable("anniversary_notification_logs")
      .set((eb) => ({
        attempt_count: eb("attempt_count", "+", 1),
        updated_at: new Date(),
      }))
      .where("anniversary_id", "=", anniversaryId)
      .where("year", "=", year)
      .execute();
  }

  async updateStatus(
    anniversaryId: string,
    year: number,
    status: "sent" | "failed"
  ): Promise<void> {
    await this.db
      .updateTable("anniversary_notification_logs")
      .set({
        status,
        updated_at: new Date(),
      })
      .where("anniversary_id", "=", anniversaryId)
      .where("year", "=", year)
      .execute();
  }

  toAnniversaryNotificationLog(
    record: Selectable<Database["anniversary_notification_logs"]>
  ): AnniversaryNotificationLog {
    return {
      anniversaryId: record.anniversary_id,
      year: record.year,
      status: record.status,
      attemptCount: record.attempt_count,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  toRecord(
    anniversaryNotificationLog: AnniversaryNotificationLog
  ): Insertable<Database["anniversary_notification_logs"]> {
    return {
      anniversary_id: anniversaryNotificationLog.anniversaryId,
      year: anniversaryNotificationLog.year,
      status: anniversaryNotificationLog.status,
      attempt_count: anniversaryNotificationLog.attemptCount,
      created_at: anniversaryNotificationLog.createdAt,
      updated_at: anniversaryNotificationLog.updatedAt,
    };
  }
}
