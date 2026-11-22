import "dotenv/config";

export type BotEnv = "development" | "production";

/**
 * 実行環境に依存する設定。
 */
export type EnvConfig = {
  /**
   * Discordボットの情報。
   */
  bot: {
    /**
     * Discordボットのトークン。
     */
    token: string;
    /**
     * DiscordボットのクライアントID。
     */
    clientId: string;
    /**
     * 開発用サーバーのID。
     * 本番環境では `null`。
     */
    devGuildId: string | null;
  };
  /**
   * ボットの実行環境。
   */
  env: BotEnv;
  /**
   * サーバーのポート番号。
   */
  serverPort: number;
  /**
   * ボットのデータベースのURL。
   */
  databaseUrl: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required.`);
  }

  return value;
}

function parseBotEnv(value: string | undefined): BotEnv {
  if (value === "development" || value === "production") {
    return value;
  }

  throw new Error("Invalid BOT_ENV.");
}

function parseServerPort(value: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid SERVER_PORT.");
  }

  return port;
}

export function createEnvConfig(): EnvConfig {
  const env = parseBotEnv(process.env.BOT_ENV);

  return {
    bot: {
      token: requireEnv("DISCORD_TOKEN"),
      clientId: requireEnv("DISCORD_CLIENT_ID"),
      devGuildId: env === "development" ? requireEnv("DEV_GUILD_ID") : null,
    },
    env,
    serverPort: parseServerPort(requireEnv("SERVER_PORT")),
    databaseUrl: requireEnv("DATABASE_URL"),
  };
}
