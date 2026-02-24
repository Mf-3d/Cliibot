import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "@/commands/Command";
import { PingUseCase } from "./usecase";
import { DiscordAdapter } from "@/infrastructure/discord/adapter";
import { Logger } from "@/utils/logger";

export class PingCommand implements Command {
  name = "ping";
  description = "Botのpingを表示します";

  constructor(private readonly useCase: PingUseCase, private readonly discordAdapter: DiscordAdapter, private readonly logger: Logger) { }

  async execute(interaction: ChatInputCommandInteraction) {
    const interactionLatency = Date.now() - interaction.createdTimestamp;
    const wsPing = this.discordAdapter.getWebSocketPing();

    if (interactionLatency > 200) this.logger.warn(`Ping latency high: ${interactionLatency}ms`);

    const message = this.useCase.ping(interactionLatency, wsPing);
    await interaction.reply(message);
  }
}