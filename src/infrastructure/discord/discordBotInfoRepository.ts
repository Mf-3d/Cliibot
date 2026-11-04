import { DiscordAdapter } from "./adapter";
import pkg from "@/../package.json";
import { BotInfoRepository } from "@/features/about/botInfoRepository";

export class DiscordBotInfoRepository implements BotInfoRepository {
  constructor(
    private readonly discordAdapter: DiscordAdapter,
    private readonly botName: string | undefined,
    private readonly isDev: boolean,
    private readonly links: { [key: string]: string },
    private readonly startTime: Date,
  ) {}

  getName(): string {
    return this.botName ?? "UNNAMED BOT";
  }

  getUsertag(): string {
    return this.discordAdapter.getBotUsertag();
  }

  getVersion(): string {
    this.startTime.getDate;
    return this.isDev
      ? `@${this.startTime.getFullYear()}-${this.startTime.getMonth() + 1}-${this.startTime.getDate()}`
      : pkg.version;
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
