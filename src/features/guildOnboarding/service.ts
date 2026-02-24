import { Guild } from "discord.js";
import { createWelcomeEmbed } from "./format";
import { Logger } from "@/utils/logger";

export class GuildOnboardingService {
  constructor (private readonly logger: Logger) { }

  sendWelcomeMessage(guild: Guild) {
    try {
      if (!guild.members.me?.permissions.has("SendMessages")) return;
      if (!guild.members.me?.permissions.has("EmbedLinks")) return;

      const channel =
        guild.systemChannel ??
        guild.channels.cache
          .filter(c => c.isTextBased())
          .first();

      if (!channel || !channel?.isTextBased()) return;

      const embed = createWelcomeEmbed();

      channel.send({
        embeds: [embed]
      });
    } catch (err) {
      this.logger.error(`Failed to send welcome message at ${guild.name} (${guild.id}): ${err}`);
    }
  }
}