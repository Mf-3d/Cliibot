import { config } from "@/config/env";
import { Logger } from "@/utils/logger";

import { registerCrashHandler } from "@/infrastructure/crash-handler";
import { createServer } from "@/infrastructure/server";
import { createClient } from "@/infrastructure/discord/client";

import { DiscordAdapter } from "@/infrastructure/discord/adapter";
import { DiscordBotInfoRepository } from "@/infrastructure/discord/discordBotInfoRepository";

import { registerReadyEvent } from "@/events/ready";
import { registerMessageCreateEvent } from "@/events/messageCreate";
import { registerInteractionEvent } from "@/events/interactionCreate";
import { registerGuildCreateEvent } from "@/events/guildCreate";

import { AboutCommand } from "@/features/about/command";
import { AboutUseCase } from "@/features/about/usecase";
import { PingUseCase } from "@/features/ping/usecase";
import { PingCommand } from "@/features/ping/command";
import { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase";
import { GuildOnboardingService } from "@/features/guildOnboarding/service";


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
  const botInfoRepository = new DiscordBotInfoRepository(discordAdapter);
  const aboutUseCase = new AboutUseCase(botInfoRepository);
  const aboutCommand = new AboutCommand(aboutUseCase);

  const pingUseCase = new PingUseCase();
  const pingCommand = new PingCommand(pingUseCase, discordAdapter, logger);

  const commands = [
    aboutCommand,
    pingCommand
  ];

  const guildOnboardingService = new GuildOnboardingService(logger);
  const guildOnBoardingUseCase = new GuildOnBoardingUseCase(guildOnboardingService);

  registerReadyEvent(client, logger, commands, config);
  registerInteractionEvent(client, logger, commands);
  registerMessageCreateEvent(client, logger);
  registerGuildCreateEvent(guildOnBoardingUseCase, client, logger);

  await client.login(process.env.DISCORD_TOKEN);

  logger.info("✔️ The bot setup is complete.");
}

async function setupServer(logger: Logger) {
  logger.info("💭 Setting up the server...");

  await createServer(config.serverPort, logger);
  
  logger.info("✔️ The server setup is complete.");
}