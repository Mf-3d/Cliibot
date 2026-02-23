import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "@/commands/Command";
import { PingUseCase } from "./usecase";
import { DiscordAdapter } from "src/infrastructure/discord/adapter";

export class PingCommand implements Command {
  name = "ping";
  description = "Botのpingを表示します";

  constructor(private readonly useCase: PingUseCase, private readonly discordAdapter: DiscordAdapter) { }

  async execute(interaction: ChatInputCommandInteraction) {
    const interactionLatency = Date.now() - interaction.createdTimestamp;
    const wsPing = this.discordAdapter.getWebSocketPing();

    const message = this.useCase.ping(interactionLatency, wsPing);
    await interaction.reply(message);
  }
}