import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { PingUseCase } from "./usecase";
import { Command } from "@/commands/Command";
import { DiscordAdapter } from "@/infrastructure/discord/adapter";
import { Logger } from "@/utils/logger";

export class PingCommand implements Command {
  name = "ping";
  description = "Botのpingを表示します";

  constructor(
    private readonly useCase: PingUseCase,
    private readonly discordAdapter: DiscordAdapter,
    private readonly logger: Logger,
  ) {}

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const interactionLatency = Date.now() - interaction.createdTimestamp;
      const wsPing = this.discordAdapter.getWebSocketPing();

      if (interactionLatency > 200)
        this.logger.warn(`Ping latency high: ${interactionLatency}ms`);

      const message = this.useCase.ping(interactionLatency, wsPing);
      await interaction.reply(message);
    } catch (err) {
      this.logger.error(`Failed to execute PingCommand: ${err}`);
      await interaction.reply({
        content: "🛑 エラーが発生しました",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
