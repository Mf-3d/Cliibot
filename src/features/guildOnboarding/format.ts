import { EmbedBuilder } from "discord.js";

export function createWelcomeEmbed() {
  return new EmbedBuilder()
  .setTitle("👋 Hello everyone!")
  .setDescription(
    "This bot was created for mf7cli's Discord server.\n" +
    "There are no features yet. I'm open to requests! 😆"
  )
  .setTimestamp()
  .setColor("#2e77ff");
}
