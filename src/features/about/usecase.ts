import { BotInfo } from "./types";
import { BotInfoRepository } from "./botInfoRepository";
import { EnvConfig } from "@/config/config";

export class AboutUseCase {
  constructor(private readonly repository: BotInfoRepository, private readonly config: EnvConfig) { }

  getBotInfo(): BotInfo {
    return {
      name: this.config.name ?? "UNNAMED BOT",
      usertag: this.repository.getUsertag(),
      version: this.repository.getVersion(),
      author: this.repository.getAuthor(),
      avatarUrl: this.repository.getAvatarUrl(),
      uptime: Math.floor(process.uptime()),
      links: this.repository.getLinks()
    };
  }
}