import type { Server } from "node:http";
import type { Logger } from "@mf-3d/logger";
import type { Client } from "discord.js";
import type { Kysely } from "kysely";

import type { Database } from "./database/schema.js";

export function registerShutdownHandler(
  client: Client,
  server: Server,
  db: Kysely<Database>,
  logger: Logger
) {
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  let isShuttingDown = false;
  let hasShutdownError = false;

  async function shutdown(signal: NodeJS.Signals) {
    if (isShuttingDown) return;

    isShuttingDown = true;

    logger.info(`Received ${signal}. Shutting down...`);

    try {
      await client.destroy();
    } catch (error) {
      logger.error("Failed to destroy the Discord client:", String(error));
      hasShutdownError = true;
    }

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
      hasShutdownError = true;
    }

    try {
      await db.destroy();
    } catch (error) {
      logger.error("Failed to close database:", String(error));
      hasShutdownError = true;
    }

    process.exitCode = hasShutdownError ? 1 : 0;
  }
}
