import { config } from "@/config/config";

import { registerGuildCreateEvent } from "@/events/guildCreate";
import { registerInteractionEvent } from "@/events/interactionCreate";
import { registerMessageCreateEvent } from "@/events/messageCreate";
import { registerReadyEvent } from "@/events/ready";

import { AboutCommand } from "@/features/about/command";
import { AboutUseCase } from "@/features/about/usecase";
import { GuildOnboardingService } from "@/features/guildOnboarding/service";
import { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase";
import { PingCommand } from "@/features/ping/command";
import { PingUseCase } from "@/features/ping/usecase";
import { registerCrashHandler } from "@/infrastructure/crash-handler";
import { DiscordAdapter } from "@/infrastructure/discord/adapter";
import { createClient } from "@/infrastructure/discord/client";
import { DiscordBotInfoRepository } from "@/infrastructure/discord/discordBotInfoRepository";
import { createServer } from "@/infrastructure/server";
import { Logger } from "@/utils/logger";

export async function bootstrap() {
  // ロガーを生成
  const logger = new Logger();
  logger.setLogLevel("info");

  registerCrashHandler(logger);

  await setupBot(logger);
  await setupServer(logger);
}

async function setupBot(logger: Logger) {
  logger.info("💭 Setting up the bot...");

  const client = createClient();

  // アダプター
  const discordAdapter = new DiscordAdapter(client);

  // コマンド
  const botInfoRepository = new DiscordBotInfoRepository(
    discordAdapter,
    config.name,
    config.links ?? {},
  );
  const aboutUseCase = new AboutUseCase(botInfoRepository, config.name);
  const aboutCommand = new AboutCommand(aboutUseCase, logger);

  const pingUseCase = new PingUseCase();
  const pingCommand = new PingCommand(pingUseCase, discordAdapter, logger);

  const commands = [aboutCommand, pingCommand];

  const guildOnboardingService = new GuildOnboardingService(logger);
  const guildOnBoardingUseCase = new GuildOnBoardingUseCase(
    guildOnboardingService,
  );

  registerReadyEvent(client, logger, commands, config.token, config.isDev, config.clientId, config.devGuildId);
  registerInteractionEvent(client, logger, commands);
  registerMessageCreateEvent(client, logger);
  registerGuildCreateEvent(guildOnBoardingUseCase, client, logger);

  await client.login(config.token);

  logger.info("✔️ The bot setup is complete.");
}

async function setupServer(logger: Logger) {
  logger.info("💭 Setting up the server...");

  await createServer(config.serverPort, logger);

  logger.info("✔️ The server setup is complete.");
}
