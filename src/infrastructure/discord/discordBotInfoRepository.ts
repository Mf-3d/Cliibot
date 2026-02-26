import { DiscordAdapter } from "./adapter";
import { BotInfoRepository } from "@/features/about/botInfoRepository";
import pkg from "@/../package.json";

export class DiscordBotInfoRepository implements BotInfoRepository {
  constructor(private readonly discordAdapter: DiscordAdapter) {}

  getName(): string {
    return process.env.BOT_NAME ?? "UNNAMED BOT";
  }

  getUsertag(): string {
    return this.discordAdapter.getBotUsertag();
  }

  getVersion(): string {
    return pkg.version;
  }

  getAuthor(): string {
    return pkg.author;
  }

  getAvatarUrl(): string {
    return this.discordAdapter.getBotAvatarUrl();
  }
}