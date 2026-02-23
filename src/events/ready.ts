import { Client } from "discord.js";
import { Logger } from "../utils/logger/";
import { Command } from "src/commands/Command";

export function registerReadyEvent(client: Client, commands: Command[], logger: Logger) {
  client.once("ready", async () => {
    logger.info(`🪵 Logged in as: ${client.user?.tag}`);

    const slashCommands = commands.map(c => ({
      name: c.name,
      description: c.description ?? "No description",
    }));

    await client.application?.commands.set(slashCommands);
  });
}