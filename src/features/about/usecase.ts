import { BotInfo } from "./types";
import { BotInfoRepository } from "./botInfoRepository";

export class AboutUseCase {
  constructor(private readonly repository: BotInfoRepository, private readonly botName: string | undefined) { }

  getBotInfo(): BotInfo {
    return {
      name: this.botName ?? "UNNAMED BOT",
      usertag: this.repository.getUsertag(),
      version: this.repository.getVersion(),
      author: this.repository.getAuthor(),
      avatarUrl: this.repository.getAvatarUrl(),
      uptime: Math.floor(process.uptime()),
      links: this.repository.getLinks()
    };
  }
}