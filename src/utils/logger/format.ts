import chalk from "chalk";
import { LogLevel } from "./levels";

export function format(level: LogLevel, message: string, emoji?: string) {
  const time = new Date().toISOString();
  let prefix = emoji ? `${emoji} ` : "";
  return `[${time}] [${level.toUpperCase()}] ${prefix}${message}`; // e.g. "[] [INFO] Hello, nice to meet you!"
}

// 色を付ける
export function colorize(level: LogLevel, text: string) {
  switch (level) {
    case "info":
      return chalk.blue(text);
    case "warn":
      return chalk.yellow.bold(text);
    case "error":
      return chalk.red.bold(text);
    default:
      return chalk.gray(text);
  }
}