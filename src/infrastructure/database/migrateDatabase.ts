import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
    }),
  });
}

export async function migrateDatabase(migrator: Migrator): Promise<void> {
  const { error } = await migrator.migrateToLatest();

  if (error) {
    throw error;
  }
}
