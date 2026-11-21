import { appConfig } from "./infrastructure/config/appConfig.js";
import { createEnvConfig, EnvConfig } from "./infrastructure/config/envConfig.js";

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
import { Logger } from "@/utils/logger/index.js";

export async function bootstrap() {
  // ロガーを生成
  const logger = new Logger();
  logger.setLogLevel("info");

  const startTime = new Date();

  const envConfig = createEnvConfig();

  logger.info(`Bot setup started at ${startTime.toLocaleString()}`);

  registerCrashHandler(logger);

  await setupBot(logger, envConfig, startTime);
  await setupServer(logger, envConfig);
}

async function setupBot(logger: Logger, envConfig: EnvConfig, startTime: Date) {
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

  await client.login(envConfig.bot.token);

  logger.info("✔️ The bot setup is complete.");
}

async function setupServer(logger: Logger, envConfig: EnvConfig) {
  logger.info("💭 Setting up the server...");

  await createServer(envConfig.serverPort, logger);

  logger.info("✔️ The server setup is complete.");
}
