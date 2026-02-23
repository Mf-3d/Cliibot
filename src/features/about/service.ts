import { BotInfo } from "./types";
import { BotInfoRepository } from "./botInfoRepository";

export class AboutUseCase {
  constructor (private readonly repository: BotInfoRepository) {}

  getBotInfo(): BotInfo {
    return {
      name: process.env.BOT_NAME ?? "UNNAMED BOT",
      usertag: this.repository.getUsertag(),
      version: this.repository.getVersion(),
      author: this.repository.getAuthor(),
      avatarUrl: this.repository.getAvatarUrl(),
      uptime: Math.floor(process.uptime())
    };
  }
}