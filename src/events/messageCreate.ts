import { Client } from "discord.js";

export function registerMessageCreateEvent(client: Client) {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content === "ping") {
      message.reply("pong!");
    }
  });
}