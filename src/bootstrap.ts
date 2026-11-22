import type { Server } from "node:http";
import { Logger } from "@mf-3d/logger";
import type { Client } from "discord.js";
import type { Kysely } from "kysely";

import { appConfig } from "./infrastructure/config/appConfig.js";
import { createEnvConfig, type EnvConfig } from "./infrastructure/config/envConfig.js";
import { createDatabase } from "./infrastructure/database/createDatabase.js";
import { createMigrator, migrateDatabase } from "./infrastructure/database/migrateDatabase.js";
import type { Database } from "./infrastructure/database/schema.js";

import { registerClientReadyEvent } from "@/events/clientReady.js";
import { registerGuildCreateEvent } from "@/events/guildCreate.js";
import { registerInteractionEvent } from "@/events/interactionCreate.js";
import { registerMessageCreateEvent } from "@/events/messageCreate.js";

import { AboutCommand } from "@/features/about/command.js";
import { AboutUseCase } from "@/features/about/usecase.js";
import { GuildOnboardingService } from "@/features/guildOnboarding/service.js";
import { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase.js";
import { PingCommand } from "@/features/ping/command.js";
import { PingUseCase } from "@/features/ping/usecase.js";
import { registerCrashHandler } from "@/infrastructure/crash-handler.js";
import { createClient } from "@/infrastructure/discord/client.js";
import { createServer } from "@/infrastructure/server.js";
import { registerShutdownHandler } from "@/infrastructure/shutdown-handler.js";
import { cleanupStartupResources } from "@/infrastructure/startup-cleanup.js";

export async function bootstrap() {
  // ロガーを生成
  const logger = new Logger();
  logger.setLogLevel("info");

  const startTime = new Date();

  const envConfig = createEnvConfig();

  logger.info(`Bot setup started at ${startTime.toLocaleString()}`);

  registerCrashHandler(logger);

  let db: Kysely<Database> | undefined;
  let client: Client | undefined;
  let server: Server | undefined;

  try {
    db = await setupDatabase(envConfig.databaseUrl, logger);
    client = await setupBot(logger, envConfig, startTime, db);
    server = await setupServer(logger, envConfig);

    registerShutdownHandler(client, server, db, logger);
  } catch (error) {
    logger.error("Bot setup failed:", String(error));

    await cleanupStartupResources(client, server, db, logger);

    process.exitCode = 1;
  }

  logger.info(`Bot setup complete!`);
}

async function setupBot(
  logger: Logger,
  envConfig: EnvConfig,
  startTime: Date,
  database: Kysely<Database>
): Promise<Client> {
  logger.info("💭 Setting up the bot...");

  const client = createClient();

  // コマンド
  const aboutUseCase = new AboutUseCase(
    client,
    appConfig.bot.name,
    appConfig.links,
    envConfig.env === "development",
    startTime
  );
  const aboutCommand = new AboutCommand(aboutUseCase, logger);

  const pingUseCase = new PingUseCase();
  const pingCommand = new PingCommand(client, pingUseCase, logger);

  const commands = [aboutCommand, pingCommand];

  const guildOnboardingService = new GuildOnboardingService(logger);
  const guildOnBoardingUseCase = new GuildOnBoardingUseCase(guildOnboardingService);

  registerClientReadyEvent(
    client,
    logger,
    commands,
    envConfig.bot.token,
    envConfig.env === "development",
    envConfig.bot.clientId,
    envConfig.bot.devGuildId
  );
  registerInteractionEvent(client, logger, commands);
  registerMessageCreateEvent(client, logger);
  registerGuildCreateEvent(guildOnBoardingUseCase, client, logger);

  try {
    await client.login(envConfig.bot.token);

    logger.info("The bot setup is complete.");
  } catch (error) {
    try {
      await client.destroy();
    } catch (cleanupError) {
      logger.error("Failed to destroy the Discord client:", String(cleanupError));
    }

    throw error;
  }

  return client;
}

async function setupServer(logger: Logger, envConfig: EnvConfig): Promise<Server> {
  logger.info("💭 Setting up the server...");

  const server = await createServer(envConfig.serverPort, logger);

  logger.info("✔️ The server setup is complete.");

  return server;
}

async function setupDatabase(connectionString: string, logger: Logger): Promise<Kysely<Database>> {
  const database = createDatabase(connectionString);
  const migrator = createMigrator(database);

  try {
    await migrateDatabase(migrator);

    logger.info("✔️ The database setup is complete.");
    return database;
  } catch (error) {
    logger.error("Database migration failed", String(error));

    try {
      await database.destroy();
    } catch (cleanupError) {
      logger.error("Failed to close database connection", String(cleanupError));
    }

    throw error;
  }
}
