import type { Client } from "discord.js";
import type { AboutBotInfo } from "./types";
import type { EnvConfig } from "@/config/config";

export class AboutUseCase {
  constructor(
    private readonly client: Client,
    private readonly config: EnvConfig
  ) {}

  getBotInfo(): AboutBotInfo {
    if (!this.client.user) throw new Error("Client is not ready.");

    return {
      name: this.config.name,
      usertag: this.client.user.tag,
      version: this.config.version,
      author: this.config.author,
      avatarUrl: this.client.user.displayAvatarURL(),
      uptime: Math.floor(process.uptime()),
      links: this.config.links,
    };
  }
}
