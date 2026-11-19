import type { Client } from "discord.js";
import packageJson from "../../../package.json";
import type { AboutBotInfo } from "./types";
import { AppConfig } from "@/infrastructure/config/appConfig";

export class AboutUseCase {
  constructor(
    private readonly client: Client,
    private readonly name: AppConfig["bot"]["name"],
    private readonly links: AppConfig["links"],
    private readonly isDev: boolean,
    private readonly startTime: Date
  ) {}

  getBotInfo(): AboutBotInfo {
    if (!this.client.user) throw new Error("Client is not ready.");

    const version = this.isDev
      ? `${packageJson.version}-dev.${this.startTime.getFullYear()}${String(
          this.startTime.getMonth() + 1
        ).padStart(2, "0")}${String(this.startTime.getDate()).padStart(2, "0")}`
      : packageJson.version;

    return {
      name: this.name,
      usertag: this.client.user.tag,
      version,
      author: packageJson.author,
      avatarUrl: this.client.user.displayAvatarURL(),
      uptime: Math.floor(process.uptime()),
      links: this.links,
    };
  }
}
