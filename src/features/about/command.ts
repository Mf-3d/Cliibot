import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { buildComponents } from "./components";
import { formatBotInfo } from "./format";
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
      const components = buildComponents(viewModel);
      await interaction.reply({
        components: [components],
        flags: MessageFlags.IsComponentsV2,
      });
    } catch (err) {
      console.error(err);
      this.logger.error(`Failed to execute AboutCommand: ${err}`);
      await interaction.reply({
        content: "🛑 エラーが発生しました",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
