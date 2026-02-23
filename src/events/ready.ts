import { Client } from "discord.js";
import { Logger } from "../utils/logger/";
import { registerCommands } from "../../src/infrastructure/discord/registerCommands";
import { Command } from "../../src/commands/Command";
import { EnvConfig } from "../../src/config/env";

export function registerReadyEvent(
  client: Client,
  logger: Logger,commands: Command[],
  config: EnvConfig
) {
  client.once("ready", async () => {
    logger.info(`🪵 Logged in as: ${client.user?.tag}`);

    registerCommands(commands, config);
  });
}