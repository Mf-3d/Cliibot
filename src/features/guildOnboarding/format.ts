import { EmbedBuilder } from "discord.js";

export function createWelcomeEmbed() {
  return new EmbedBuilder()
  .setTitle("👋 Hello everyone!")
  .setDescription(
    "This bot was created for mf7cli's Discord server.\n" +
    "It has features such as displaying rankings and linking with Github."
  )
  .setTimestamp()
  .setColor("#2e77ff");
}