import "dotenv/config";

type BotEnv = "dev" | "production";

export interface EnvConfig {
  name: string;
  token: string;
  clientId: string;
  botEnv?: BotEnv;
  guildId?: string;
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

export const config: EnvConfig = {
  name: requireEnv("BOT_NAME"),
  token: requireEnv("DISCORD_TOKEN"),
  clientId: requireEnv("DISCORD_CLIENT_ID"),
  botEnv,
  isDev: botEnv === "dev",
  guildId:
    botEnv === "dev"
      ? requireEnv("DEV_GUILD_ID")
      : undefined,
  serverPort: Number(requireEnv("SERVER_PORT")),
};