import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { formatBotInfo, toComponents, toEmbed } from "./format";
import { AboutUseCase } from "./usecase";
import { Command } from "@/commands/Command";
import { Logger } from "@/utils/logger";

export class AboutCommand implements Command {
  name = "about";
  description = "Botの情報を表示します";

  constructor(
    private readonly useCase: AboutUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const info = this.useCase.getBotInfo();
      const viewModel = formatBotInfo(info);
      // const embed = toEmbed(viewModel);
      const components = toComponents(viewModel);
      await interaction.reply({
        // embeds: [embed],
        components: [components],
        flags: MessageFlags.IsComponentsV2,
      });
    } catch (err) {
      console.error(err);
      this.logger.error(`Failed to execute AboutCommand: ${err}`);
      interaction.reply({
        content: "🛑 エラーが発生しました",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
