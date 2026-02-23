import { Client } from "discord.js";
import { Command } from "@/commands/Command";

export function registerInteractionEvent(client: Client, commands: Command[]) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.find(c => c.name === interaction.commandName);
    await command?.execute(interaction);
  });
}