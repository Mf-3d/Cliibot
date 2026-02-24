import { Client } from "discord.js";
import { Logger } from "@/utils/logger/";
export class DiscordAdapter {
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
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