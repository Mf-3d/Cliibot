import type { Logger } from "@mf-3d/logger";
import type { Guild } from "discord.js";
import { createWelcomeEmbed } from "./format.js";

export class GuildOnboardingService {
  constructor(private readonly logger: Logger) {}

  async sendWelcomeMessage(guild: Guild) {
    try {
      if (!guild.members.me?.permissions.has("SendMessages")) return;
      if (!guild.members.me?.permissions.has("EmbedLinks")) return;

      const channel =
        guild.systemChannel ?? guild.channels.cache.filter((c) => c.isTextBased()).first();

      if (!channel || !channel?.isTextBased()) return;

      const embed = createWelcomeEmbed();

      await channel.send({
        embeds: [embed],
      });
    } catch (err) {
      this.logger.error(`Failed to send welcome message at ${guild.name} (${guild.id}): ${err}`);
    }
  }
}
