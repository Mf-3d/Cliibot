import { Client } from "discord.js";
import { logger } from "../utils/logger";

export function registerMessageCreateEvent(client: Client) {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    logger.info(
      `💬 Message from ${message.author.tag}: ${message.content}`
    );

    if (message.content === "ping") {
      message.reply("pong!");
    }
  });
}