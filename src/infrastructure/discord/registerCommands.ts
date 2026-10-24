import { REST, Routes } from "discord.js";
import { Command } from "@/commands/Command";
import { EnvConfig } from "@/config/config";

export async function registerCommands(
  commands: Command[],
  config: EnvConfig) {
  const rest = new REST({ version: "10" }).setToken(config.token);

  const slashCommands = commands.map(c => ({
    name: c.name,
    description: c.description ?? "No description",
  }));

  if (config.isDev) {
    if (!config.devGuildId) throw new Error("DEV_GUILD_ID is not defined.");

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.devGuildId),
      { body: slashCommands }
    );
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body: slashCommands });
  }
}