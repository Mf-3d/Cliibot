import { Client } from "discord.js";
import { Logger } from "../utils/logger/";

export function registerMessageCreateEvent(client: Client, logger: Logger) {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    logger.info(`💬 Message from ${message.author.tag}: ${message.content}`);

    if (message.content === "ping") {
      message.reply("pong!");
    }
  });
}