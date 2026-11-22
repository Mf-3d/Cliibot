import type { Logger } from "@mf-3d/logger";
import { type ChatInputCommandInteraction, type Client, MessageFlags } from "discord.js";
import type { PingUseCase } from "./usecase.js";
import type { Command } from "@/commands/Command.js";

export class PingCommand implements Command {
  name = "ping";
  description = "Botのpingを表示します";

  constructor(
    private readonly client: Client,
    private readonly useCase: PingUseCase,
    private readonly logger: Logger
  ) {}

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const interactionLatency = Date.now() - interaction.createdTimestamp;
      const wsPing = this.client.ws.ping;

      if (interactionLatency > 200) this.logger.warn(`Ping latency high: ${interactionLatency}ms`);

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
