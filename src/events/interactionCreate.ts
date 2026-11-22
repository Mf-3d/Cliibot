import type { Logger } from "@mf-3d/logger";
import type { Client } from "discord.js";
import type { Command } from "@/commands/Command.js";

export function registerInteractionEvent(client: Client, logger: Logger, commands: Command[]) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      const command = commands.find((c) => c.name === interaction.commandName);
      await command?.execute(interaction);
    } catch (err) {
      logger.error(`Failed to reply interaction: "${interaction.commandName}": ${err}`);

      // interaction がすでに返信済みの場合は followUp を使う
      if (interaction.replied || interaction.deferred) {
        await interaction
          .followUp({
            content: "**🛑 エラーが発生しました**",
            ephemeral: true,
          })
          .catch(() => {}); // ここでも失敗する可能性あり
      } else {
        await interaction
          .reply({
            content: "**🛑 エラーが発生しました**",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  });
}
