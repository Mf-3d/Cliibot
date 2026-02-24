import { config } from "@/config/env";
import { createClient } from "@/infrastructure/discord/client";
import { registerReadyEvent } from "@/events/ready";
import { registerMessageCreateEvent } from "@/events/messageCreate";
import { registerInteractionEvent } from "@/events/interactionCreate";
import { Logger } from "@/utils/logger";
import { DiscordAdapter } from "@/infrastructure/discord/adapter";
import { AboutCommand } from "@/features/about/command";
import { AboutUseCase } from "@/features/about/usecase";
import { PingUseCase } from "@/features/ping/usecase";
import { PingCommand } from "@/features/ping/command";
import { DiscordBotInfoRepository } from "@/features/about/discordBotInfoRepository";

// ロガーを生成
const logger = new Logger();
logger.setLogLevel("info");

process.on("unhandledRejection", (reason, _promise) => {
  logger.error(`[Unhandled Rejection] ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`[Uncaught Exception] ${err}`);
});

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

registerInteractionEvent(client, logger, commands);
registerReadyEvent(client, logger, commands, config);
registerMessageCreateEvent(client, logger);

client.login(process.env.DISCORD_TOKEN);