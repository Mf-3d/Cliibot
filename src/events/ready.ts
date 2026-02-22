import { Client } from "discord.js";
import { logger } from "../utils/logger";
import { Command } from "src/commands/command";

export function registerReadyEvent(client: Client, commands: Command[]) {
  client.once("ready", async () => {
    logger.info(`Logged in as: ${client.user?.tag}`, {
      emoji: "🪵"
    });

    const slashCommands = commands.map(c => ({
      name: c.name,
      description: c.description ?? "No description",
    }));

    await client.application?.commands.set(slashCommands);
  });
}