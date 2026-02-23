import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import stripAnsi from "strip-ansi";

import { LogLevel } from "./levels";

export interface Writer {
  write(level: LogLevel, text: string): void;
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

export class FileWriter implements Writer {
  private filePath: string;

  constructor() {
    this.filePath = path.join("logs", "app.log");
  }

  write(_level: LogLevel, text: string): void {
    const plain = stripAnsi(text);

    const dir = path.dirname(this.filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(this.filePath, `${plain}\n`);
  }
}