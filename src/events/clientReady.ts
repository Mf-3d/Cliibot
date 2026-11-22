import type { Logger } from "@mf-3d/logger";
import type { Client } from "discord.js";
import type { Command } from "@/commands/Command.js";
import { registerCommands } from "@/infrastructure/discord/registerCommands.js";

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
