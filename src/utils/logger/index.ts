import chalk from "chalk";
import { LOG_LEVEL_PRIORITY, LogLevel } from "./levels";

type NormalizedLog = {
  message: string;
  stack?: string
};

interface Writer {
  write(level: LogLevel, text: string, prefix?: string): void;
}

export class Logger {
  private currentLogLevel: LogLevel = "info";
  private normalizer: Normalizer;
  private formatter: Formatter;
  private writers: Writer[];

  constructor () {
    this.normalizer = new Normalizer();
    this.formatter = new Formatter();
    this.writers = [ new ConsoleWriter() ];
  }

  setLogLevel(level: LogLevel) {
    this.currentLogLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      LOG_LEVEL_PRIORITY[level] >=
      LOG_LEVEL_PRIORITY[this.currentLogLevel]
    );
  }

  /**
   * @param level Log Level.
   * @param normalized Normalized Log.
   * @returns 
   */
  private output (level: LogLevel, normalized: NormalizedLog) {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatter.format(level, normalized.message);
    this.writers.forEach(writer => writer.write(level, formatted));
  }

  info (message: string) {
    this.output("info", this.normalizer.normalize(message));;
  }

  warn (message: string) {
    this.output("warn", this.normalizer.normalize(message));;
  }

  error (message: string | Error) {
    this.output("info", this.normalizer.normalize(message));;
  }
}

class Normalizer {
  normalize(err: Error | string): NormalizedLog {
    if (err instanceof Error) {
      return {
        message: err.message,
        stack: err.stack,
      }
    } else {
      return {
        message: err,
      }
    }
  }
}

class Formatter {
  format(level: LogLevel, message: string): string {
    const time = new Date().toISOString();
    return [
      `[${time}]`,
      `[${level.toUpperCase()}]`,
      message
    ].join(" "); // e.g. "[] [INFO] Hello, nice to meet you!"
  }
}

class ConsoleWriter implements Writer {
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