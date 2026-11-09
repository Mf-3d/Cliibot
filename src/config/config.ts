import appConfig from "@/../config.json";
import pkg from "@/../package.json";
import "dotenv/config";

type BotEnv = "dev" | "production";

export interface EnvConfig {
  name: string;
  version: string;
  author: string;
  links: { [key: string]: string };
  token: string;
  clientId: string;
  botEnv?: BotEnv;
  devGuildId: string | null;
  isDev: boolean;
  serverPort: number;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function parseBotEnv(value: string | undefined): BotEnv {
  if (value === "dev" || value === "production") {
    return value;
  }

  throw new Error("Invalid BOT_ENV");
}

const botEnv = parseBotEnv(requireEnv("BOT_ENV"));
const isDev = botEnv === "dev";

/**
 * @deprecated
 */
export const config: EnvConfig = {
  name: appConfig.bot.name ?? "UNNAMED BOT",
  version: pkg.version,
  author: pkg.author,
  links: appConfig.links,
  token: requireEnv("DISCORD_TOKEN"),
  clientId: requireEnv("DISCORD_CLIENT_ID"),
  botEnv,
  isDev,
  devGuildId: botEnv === "dev" ? requireEnv("DEV_GUILD_ID") : null,
  serverPort: Number(requireEnv("SERVER_PORT")),
};

export function createConfig(startTime: Date): EnvConfig {
  return {
    name: appConfig.bot.name ?? "UNNAMED BOT",
    version: isDev
      ? `@${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`
      : pkg.version,
    author: pkg.author,
    links: appConfig.links ?? {},
    token: requireEnv("DISCORD_TOKEN"),
    clientId: requireEnv("DISCORD_CLIENT_ID"),
    botEnv,
    isDev,
    devGuildId: botEnv === "dev" ? requireEnv("DEV_GUILD_ID") : null,
    serverPort: Number(requireEnv("SERVER_PORT")),
  };
}
