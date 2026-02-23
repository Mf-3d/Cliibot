import "dotenv/config";

import { createClient } from "./client";
import { registerReadyEvent } from "./events/ready";
import { registerMessageCreateEvent } from "./events/messageCreate";
import { registerInteractionEvent } from "./events/interactionCreate";
import { Logger } from "./utils/logger";
import { DiscordAdapter } from "./infrastructure/discord/adapter";
import { AboutCommand } from "./features/about/command";
import { AboutUseCase } from "./features/about/service";
import { PingUseCase } from "./features/ping/service";
import { PingCommand } from "./features/ping/command";

const logger = new Logger();
logger.setLogLevel("info");

const client = createClient();

// アダプター
const discordAdapter = new DiscordAdapter(client, logger);

// コマンド
const aboutUseCase = new AboutUseCase(discordAdapter);
const aboutCommand = new AboutCommand(aboutUseCase);

const pingUseCase = new PingUseCase();
const pingCommand = new PingCommand(pingUseCase, discordAdapter);

const commands = [
  aboutCommand,
  pingCommand
];

registerInteractionEvent(client, commands);
registerReadyEvent(client, commands, logger);
registerMessageCreateEvent(client, logger);

client.login(process.env.DISCORD_TOKEN);