import type { Client } from "discord.js";
import packageJson from "../../../package.json";
import type { AboutBotInfo } from "./types";
import { AppConfig } from "@/infrastructure/config/appConfig";

export class AboutUseCase {
  constructor(
    private readonly client: Client,
    private readonly name: AppConfig["bot"]["name"],
    private readonly links: AppConfig["links"],
    private readonly isDev: boolean
  ) {}

  getBotInfo(): AboutBotInfo {
    if (!this.client.user) throw new Error("Client is not ready.");

    const now = new Date();

    return {
      name: this.name,
      usertag: this.client.user.tag,
      version: this.isDev
        ? `${packageJson.version}-dev.${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
        : packageJson.version,
      author: packageJson.author,
      avatarUrl: this.client.user.displayAvatarURL(),
      uptime: Math.floor(process.uptime()),
      links: this.links,
    };
  }
}
