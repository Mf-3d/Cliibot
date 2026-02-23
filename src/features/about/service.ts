import { DiscordAdapter } from "../../../src/infrastructure/discord/adapter";
import pkg from "../../../package.json";
import { BotInfo } from "./types";

export class AboutUseCase {
  private readonly discordAdapter;
  
  constructor (discordAdapter: DiscordAdapter) {
    this.discordAdapter = discordAdapter;
  }

  getBotInfo(): BotInfo {
    return {
      name: process.env.BOT_NAME ?? "UNNAMED BOT",
      usertag: this.discordAdapter.getBotUsertag(),
      version: pkg.version,
      author: pkg.author,
      avatarUrl: this.discordAdapter.getBotAvatarUrl(),
      uptime: Math.floor(process.uptime())
    };
  }
}