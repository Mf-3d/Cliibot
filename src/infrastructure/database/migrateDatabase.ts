import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Logger } from "@mf-3d/logger";
import type { Kysely } from "kysely";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import type { Database } from "./schema.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationFolder = path.join(currentDirectory, "migrations");

export function createMigrator(db: Kysely<Database>): Migrator {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
      import: (filePath) => import(pathToFileURL(filePath).href),
    }),
  });
}

export async function migrateDatabase(migrator: Migrator, logger: Logger): Promise<void> {
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((result) => {
    if (result.status === "Success") {
      logger.info(`Migration "${result.migrationName}" completed.`);
    }
  });

  if (error) {
    throw error;
  }
}
