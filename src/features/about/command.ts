import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "@/commands/Command";
import { AboutUseCase } from "./usecase";
import { formatBotInfo, toEmbed } from "./format";

export class AboutCommand implements Command {
  name = "about";
  description = "Botの情報を表示します";

  constructor(private readonly useCase: AboutUseCase) { }

  async execute(interaction: ChatInputCommandInteraction) {
    const info = this.useCase.getBotInfo();
    const viewModel = formatBotInfo(info);
    const embed = toEmbed(viewModel);
    await interaction.reply({
      embeds: [embed]
    });
  }
}