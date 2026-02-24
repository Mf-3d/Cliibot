import { Client } from "discord.js";
import { Logger } from "@/utils/logger/";

export function registerMessageCreateEvent(client: Client, logger: Logger) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "ping") {
      logger.info(`💬 Message from ${message.author.tag}: ${message.content}`);
      try {
        message.reply("pong!");
      } catch (err) {
        logger.error(`Failed to reply message from "${message.author.tag}": ${err}`);

        await message.reply("**🛑 エラーが発生しました**").catch(() => {});
      }
    }
  });
}