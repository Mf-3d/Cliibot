import chalk from "chalk";

type LogLevel = "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  info: 1,
  warn: 2,
  error: 3,
};

let currentLogLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return (
    LOG_LEVEL_PRIORITY[level] >=
    LOG_LEVEL_PRIORITY[currentLogLevel]
  ); // e.g. 1 ("info") >= 2 ("warn", Current log level)
}

function format(level: LogLevel, message: string) {
  const time = new Date().toISOString();
  return `[${time}] [${level.toUpperCase()}] ${message}`; // e.g. "[] [INFO] 👋 Hello, nice to meet you!"
}

// 色を付ける
function colorize(level: LogLevel, text: string) {
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

function output(level: LogLevel, message: string) {
  if (!shouldLog(level)) return;
  
  const formatted = format(level, message);

  writeToConsole(level, formatted);
}

function writeToConsole(level: LogLevel, text: string) {
  const colored = colorize(level, text);

  if (level === "error") {
    console.error(colored);
  } else if (level === "warn") {
    console.warn(colored);
  } else {
    console.log(colored);
  }
}

export const logger = {
  info(message: string) {
    output("info", message);
  },
  warn(message: string) {
    output("warn", message);
  },
  error(message: string) {
    output("error", message);
  },
};