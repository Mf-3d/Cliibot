import { PGlite } from "@electric-sql/pglite";
import { Kysely, PGliteDialect } from "kysely";

import type { Database } from "@/infrastructure/database/schema.js";

export function createTestDatabase(): Kysely<Database> {
  const pglite = new PGlite();

  return new Kysely<Database>({
    dialect: new PGliteDialect({
      pglite,
    }),
  });
}
