import type { Logger } from "@mf-3d/logger";
import type { Kysely, Selectable } from "kysely";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMigrator,
  migrateDatabase,
} from "../../../infrastructure/database/migrateDatabase.js";
import type { Database } from "../../../infrastructure/database/schema.js";
import { createTestDatabase } from "../../../test/helpers/createTestDatabase.js";
import type { AnniversaryNotificationLog } from "./model.js";
import { AnniversaryNotificationLogRepository } from "./repository.js";

describe("AnniversaryNotificationLogRepository", () => {
  let logger: Logger;
  let db: Kysely<Database>;
  let repository: AnniversaryNotificationLogRepository;

  beforeEach(async () => {
    logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;
    db = createTestDatabase();
    const migrator = createMigrator(db);
    await migrateDatabase(migrator, logger);
    repository = new AnniversaryNotificationLogRepository(db);
  });

  afterEach(async () => {
    await db.destroy();
  });

  describe("findByAnniversaryIdAndYear()", () => {
    it("Retrieves the record for the specified anniversary ID and year", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await repository.create(anniversaryId, year);

      const foundLog = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

      expect(foundLog).toEqual({
        anniversaryId,
        year,
        status: "pending",
        attemptCount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Returns null if no record matches the specified anniversary ID and year", async () => {
      const anniversaryId = "test";
      const year = 2026;

      const foundLog = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

      expect(foundLog).toBeNull();
    });
  });

  describe("create()", () => {
    it("Creates a new record", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await repository.create(anniversaryId, year);

      const foundLog = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

      expect(foundLog).toEqual({
        anniversaryId,
        year,
        status: "pending",
        attemptCount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Creates multiple records with the same anniversary ID and different years", async () => {
      const anniversaryId = "test";

      await repository.create(anniversaryId, 2026);
      await repository.create(anniversaryId, 2027);

      const foundLog2026 = await repository.findByAnniversaryIdAndYear(anniversaryId, 2026);
      const foundLog2027 = await repository.findByAnniversaryIdAndYear(anniversaryId, 2027);

      expect(foundLog2026).toEqual({
        anniversaryId,
        year: 2026,
        status: "pending",
        attemptCount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(foundLog2027).toEqual({
        anniversaryId,
        year: 2027,
        status: "pending",
        attemptCount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Creates multiple records with the same year and different anniversary IDs", async () => {
      const year = 2026;

      await repository.create("test1", year);
      await repository.create("test2", year);

      const foundLog1 = await repository.findByAnniversaryIdAndYear("test1", year);
      const foundLog2 = await repository.findByAnniversaryIdAndYear("test2", year);

      expect(foundLog1).toEqual({
        anniversaryId: "test1",
        year,
        status: "pending",
        attemptCount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(foundLog2).toEqual({
        anniversaryId: "test2",
        year,
        status: "pending",
        attemptCount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Throws an error when creating a duplicate record", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await repository.create(anniversaryId, year);
      await expect(repository.create(anniversaryId, year)).rejects.toThrow();
    });
  });

  describe("incrementAttemptCount()", () => {
    it("Increments the attempt count", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await repository.create(anniversaryId, year);

      await repository.incrementAttemptCount(anniversaryId, year);

      const foundLog = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

      expect(foundLog).toEqual({
        anniversaryId,
        year,
        status: "pending",
        attemptCount: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Increments the attempt count multiple times", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await repository.create(anniversaryId, year);

      await repository.incrementAttemptCount(anniversaryId, year);
      await repository.incrementAttemptCount(anniversaryId, year);

      const foundLog = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

      expect(foundLog).toEqual({
        anniversaryId,
        year,
        status: "pending",
        attemptCount: 2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Does not throw an error when the record does not exist", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await expect(repository.incrementAttemptCount(anniversaryId, year)).resolves.toBeUndefined();
    });
  });

  describe("updateStatus()", () => {
    it("Updates the status to sent", async () => {
      vi.useFakeTimers();

      try {
        vi.setSystemTime(new Date("2026-02-07T00:00:00Z"));

        const anniversaryId = "test";
        const year = 2026;

        await repository.create(anniversaryId, year);

        const foundLog1 = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

        vi.setSystemTime(new Date("2026-02-08T00:00:00Z"));

        await repository.updateStatus(anniversaryId, year, "sent");

        const foundLog2 = await repository.findByAnniversaryIdAndYear(anniversaryId, year);

        expect(foundLog1).not.toBeNull();
        expect(foundLog2).not.toBeNull();

        expect(foundLog1?.status).toEqual("pending");
        expect(foundLog2?.status).toEqual("sent");

        expect(foundLog2?.updatedAt).not.toEqual(foundLog1?.updatedAt);
      } finally {
        vi.useRealTimers();
      }
    });

    it("Updates the status to failed", async () => {
      const anniversaryId = "test";
      const year = 2026;

      await repository.create(anniversaryId, year);

      const foundLog1 = await repository.findByAnniversaryIdAndYear(anniversaryId, year);
      expect(foundLog1?.status).toEqual("pending");

      await repository.updateStatus(anniversaryId, year, "failed");

      const foundLog2 = await repository.findByAnniversaryIdAndYear(anniversaryId, year);
      expect(foundLog2?.status).toEqual("failed");

      expect(foundLog1).not.toBeNull();
      expect(foundLog2).not.toBeNull();

      expect(foundLog2?.updatedAt).not.toEqual(foundLog1?.updatedAt);
    });
  });

  describe("toAnniversaryNotificationLog()", () => {
    it("Converts a database record into an anniversary notification log", () => {
      const record: Selectable<Database["anniversary_notification_logs"]> = {
        anniversary_id: "test",
        year: 2026,
        status: "sent",
        attempt_count: 2,
        created_at: new Date("2026-02-07T00:00:00Z"),
        updated_at: new Date("2026-02-08T00:00:00Z"),
      };

      const anniversaryNotificationLog: AnniversaryNotificationLog =
        repository.toAnniversaryNotificationLog(record);

      expect(anniversaryNotificationLog).toEqual({
        anniversaryId: record.anniversary_id,
        year: record.year,
        status: record.status,
        attemptCount: record.attempt_count,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      });
    });
  });

  describe("toRecord()", () => {
    let logger: Logger;
    let db: Kysely<Database>;
    let repository: AnniversaryNotificationLogRepository;

    beforeEach(async () => {
      logger = {
        info: vi.fn(),
        error: vi.fn(),
      } as unknown as Logger;
      db = createTestDatabase();
      const migrator = createMigrator(db);
      await migrateDatabase(migrator, logger);
      repository = new AnniversaryNotificationLogRepository(db);
    });

    afterEach(async () => {
      await db.destroy();
    });

    it("Converts an anniversary notification log into a database record", () => {
      const anniversaryNotificationLog: AnniversaryNotificationLog = {
        anniversaryId: "test",
        year: 2026,
        status: "sent",
        attemptCount: 2,
        createdAt: new Date("2026-02-07T00:00:00Z"),
        updatedAt: new Date("2026-02-08T00:00:00Z"),
      };

      const record = repository.toRecord(anniversaryNotificationLog);

      expect(record).toEqual({
        anniversary_id: anniversaryNotificationLog.anniversaryId,
        year: anniversaryNotificationLog.year,
        status: anniversaryNotificationLog.status,
        attempt_count: anniversaryNotificationLog.attemptCount,
        created_at: anniversaryNotificationLog.createdAt,
        updated_at: anniversaryNotificationLog.updatedAt,
      });
    });
  });
});
