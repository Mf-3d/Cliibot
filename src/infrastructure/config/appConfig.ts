import appConfigJson from "@/../config.json";

/**
 * アプリケーション固有の設定。
 */
export type AppConfig = {
  /**
   * Discordボットの情報。
   */
  bot: {
    /**
     * ボットの名前。
     */
    name: string;
  };

  /**
   * About コマンドで表示するリンクの一覧。
   */
  links: Record<string, string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function loadAppConfig(config: unknown): AppConfig {
  if (!isRecord(config)) {
    throw new Error("Could not load config.json: config.json must be an object.");
  }

  const bot = config.bot;

  if (!isRecord(bot)) {
    throw new Error("Could not load config.json: bot must be an object.");
  }

  if (typeof bot.name !== "string" || bot.name.trim() === "") {
    throw new Error("Could not load config.json: bot.name must be a non-empty string.");
  }

  const links = config.links;

  if (links === undefined) {
    return {
      bot: {
        name: bot.name,
      },
      links: {},
    };
  }

  if (!isRecord(links)) {
    throw new Error("Could not load config.json: links must be an object.");
  }

  const normalizedLinks: Record<string, string> = {};

  for (const [key, value] of Object.entries(links)) {
    if (typeof value !== "string") {
      throw new Error("Could not load config.json: all links values must be strings.");
    }

    normalizedLinks[key] = value;
  }

  return {
    bot: {
      name: bot.name,
    },
    links: normalizedLinks,
  };
}

export const appConfig = loadAppConfig(appConfigJson);
