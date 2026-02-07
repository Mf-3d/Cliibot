import chalk from "chalk";
import { Client } from "discord.js";

export function registerReadyEvent(client: Client) {
  client.once("ready", () => {
    console.info(`🪵  Logged in as: ${chalk.bold(client.user?.tag)}`);
  });
}