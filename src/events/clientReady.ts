import { Client } from "discord.js";
import { Command } from "@/commands/Command";
import { registerCommands } from "@/infrastructure/discord/registerCommands";
import { Logger } from "@/utils/logger/";

export function registerClientReadyEvent(
  client: Client,
  logger: Logger,
  commands: Command[],
  token: string,
  isDev: boolean,
  clientId: string,
  devGuildId: string | null
) {
  client.once("clientReady", async () => {
    logger.info(`🪵 Logged in as: ${client.user?.tag}`);

    try {
      registerCommands(commands, token, isDev, clientId, devGuildId);
    } catch (err) {
      logger.error(`Failed to register commands: ${err}`);
    }
  });
}
