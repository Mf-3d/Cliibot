import { REST, Routes } from "discord.js";
import { Command } from "@/commands/Command";

export async function registerCommands(
  commands: Command[],
  token: string,
  isDev: boolean,
  clientId: string,
  devGuildId: string | null,
) {
  const rest = new REST({ version: "10" }).setToken(token);

  const slashCommands = commands.map((c) => ({
    name: c.name,
    description: c.description ?? "No description",
  }));

  if (isDev) {
    if (!devGuildId) throw new Error("DEV_GUILD_ID is not defined.");

    await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), {
      body: slashCommands,
    });
  } else {
    await rest.put(Routes.applicationCommands(clientId), {
      body: slashCommands,
    });
  }
}
