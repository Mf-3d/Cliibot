import type { Client } from "discord.js";
import packageJson from "../../../package.json";
import type { AboutBotInfo } from "./types";
import { AppConfig } from "@/infrastructure/config/appConfig";

export class AboutUseCase {
  constructor(
    private readonly client: Client,
    private readonly name: AppConfig["bot"]["name"],
    private readonly links: AppConfig["links"]
  ) {}

  getBotInfo(): AboutBotInfo {
    if (!this.client.user) throw new Error("Client is not ready.");

    return {
      name: this.name,
      usertag: this.client.user.tag,
      version: packageJson.version,
      author: packageJson.author,
      avatarUrl: this.client.user.displayAvatarURL(),
      uptime: Math.floor(process.uptime()),
      links: this.links,
    };
  }
}
