import type { Logger } from "@mf-3d/logger";

export function registerCrashHandler(logger: Logger) {
  logger.info("💭 Registering the crash handler...");

  process.on("unhandledRejection", (reason) => {
    logger.error(`[Unhandled Rejection] ${reason}`);
  });

  process.on("uncaughtException", (err) => {
    logger.error(`[Uncaught Exception] ${err}`);
  });

  logger.info("✔️ Registered the crash handler.");
}
