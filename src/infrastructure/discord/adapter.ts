import { Client } from "discord.js";
import { Logger } from "@/utils/logger/";
export class DiscordAdapter {
  private readonly client: Client;
  private readonly logger: Logger;

  constructor(client: Client, logger: Logger) {
    this.client = client;
    this.logger = logger;
  }

  getWebSocketPing(): number {
    return this.client.ws.ping;
  }

  getBotAvatarUrl() {
    if (!this.client.user)  throw new Error("Client is not ready.");

    return this.client.user.displayAvatarURL();
  }

  getBotUsertag() {
    if (!this.client.user)  throw new Error("Client is not ready.");

    return this.client.user.tag;
  }
}