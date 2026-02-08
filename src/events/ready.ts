import { Client } from "discord.js";
import { logger } from "../utils/logger";

export function registerReadyEvent(client: Client) {
  client.once("ready", () => {
    logger.info(`🪵  Logged in as: ${client.user?.tag}`);
  });
}