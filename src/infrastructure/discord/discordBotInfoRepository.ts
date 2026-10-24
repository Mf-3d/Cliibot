import { DiscordAdapter } from "./adapter";
import { BotInfoRepository } from "@/features/about/botInfoRepository";
import pkg from "@/../package.json";
import { EnvConfig } from "@/config/config";

export class DiscordBotInfoRepository implements BotInfoRepository {
  constructor(private readonly discordAdapter: DiscordAdapter, private readonly config: EnvConfig) { }

  getName(): string {
    return this.config.name ?? "UNNAMED BOT";
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