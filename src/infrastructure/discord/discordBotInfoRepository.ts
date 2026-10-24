import { DiscordAdapter } from "./adapter";
import pkg from "@/../package.json";
import { BotInfoRepository } from "@/features/about/botInfoRepository";

export class DiscordBotInfoRepository implements BotInfoRepository {
  constructor(
    private readonly discordAdapter: DiscordAdapter,
    private readonly botName: string | undefined,
    private readonly links: { [key: string]: string },
  ) {}

  getName(): string {
    return this.botName ?? "UNNAMED BOT";
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

  getLinks(): {
    [key: string]: string;
  } {
    return this.links ?? {};
  }
}
