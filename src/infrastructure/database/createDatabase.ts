import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./schema.js";

export function createDatabase(connectionString: string) {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString,
    }),
  });

  return new Kysely<Database>({
    dialect,
  });
}
