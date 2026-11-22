import type { Server } from "node:http";
import type { Client } from "discord.js";
import type { Kysely } from "kysely";
import type { Database } from "./database/schema.js";
import type { Logger } from "@/utils/logger/index.js";

export async function cleanupStartupResources(
  client: Client | undefined,
  server: Server | undefined,
  db: Kysely<Database> | undefined,
  logger: Logger
): Promise<void> {
  if (client) {
    try {
      await client.destroy();
    } catch (error) {
      logger.error("Failed to destroy the Discord client:", String(error));
    }
  }

  if (server) {
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    } catch (error) {
      logger.error("Failed to close HTTP server:", String(error));
    }
  }

  if (db) {
    try {
      await db.destroy();
    } catch (error) {
      logger.error("Failed to close database:", String(error));
    }
  }
}
