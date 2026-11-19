import { appConfig } from "./infrastructure/config/appConfig";
import { createEnvConfig, EnvConfig } from "./infrastructure/config/envConfig";

import { registerClientReadyEvent } from "@/events/clientReady";
import { registerGuildCreateEvent } from "@/events/guildCreate";
import { registerInteractionEvent } from "@/events/interactionCreate";
import { registerMessageCreateEvent } from "@/events/messageCreate";

import { AboutCommand } from "@/features/about/command";
import { AboutUseCase } from "@/features/about/usecase";
import { GuildOnboardingService } from "@/features/guildOnboarding/service";
import { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase";
import { PingCommand } from "@/features/ping/command";
import { PingUseCase } from "@/features/ping/usecase";
import { registerCrashHandler } from "@/infrastructure/crash-handler";
import { DiscordAdapter } from "@/infrastructure/discord/adapter";
import { createClient } from "@/infrastructure/discord/client";
import { createServer } from "@/infrastructure/server";
import { Logger } from "@/utils/logger";

export async function bootstrap() {
  // ロガーを生成
  const logger = new Logger();
  logger.setLogLevel("info");

  const startTime = new Date();

  const envConfig = createEnvConfig();

  logger.info(`Bot setup started at ${startTime.toLocaleString()}`);

  registerCrashHandler(logger);

  await setupBot(logger, envConfig);
  await setupServer(logger, envConfig);
}

async function setupBot(logger: Logger, envConfig: EnvConfig) {
  logger.info("💭 Setting up the bot...");

  const client = createClient();

  // アダプター
  const discordAdapter = new DiscordAdapter(client);

  // コマンド
  const aboutUseCase = new AboutUseCase(client, appConfig.bot.name, appConfig.links);
  const aboutCommand = new AboutCommand(aboutUseCase, logger);

  const pingUseCase = new PingUseCase();
  const pingCommand = new PingCommand(pingUseCase, discordAdapter, logger);

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
