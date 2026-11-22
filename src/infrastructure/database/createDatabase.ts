import fs from "node:fs";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./schema.js";

export function createDatabase(connectionString: string) {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString,
      ssl: {
        ca: fs.readFileSync("./certificates/prod-ca-2021.crt", "utf8"),
        rejectUnauthorized: true,
      },
    }),
  });

  return new Kysely<Database>({
    dialect,
  });
}
