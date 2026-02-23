import chalk from "chalk";

import { LogLevel } from "./levels";

export interface Writer {
  write(level: LogLevel, text: string, prefix?: string): void;
}

export class ConsoleWriter implements Writer {
  write(level: LogLevel, text: string) {
    const colored = this.colorize(level, text);
  
    if (level === "error") {
      console.error(colored);
    } else if (level === "warn") {
      console.warn(colored);
    } else {
      console.log(colored);
    }
  }

  // 色を付ける
  private colorize(level: LogLevel, text: string) {
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
}