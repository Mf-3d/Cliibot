import { colorize, format } from "./format";
import { LOG_LEVEL_PRIORITY, LogLevel } from "./levels";
import { normalize, NormalizedLog } from "./normalize";

type LogOptions = {
  emoji?: string;
  fileOnly?: string;
};

let currentLogLevel: LogLevel = "info";

/**
 * @param level The minimum level to log.
 */
export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

/**
 * @param level Log Level.
 */
function shouldLog(level: LogLevel): boolean {
  return (
    LOG_LEVEL_PRIORITY[level] >=
    LOG_LEVEL_PRIORITY[currentLogLevel]
  );
}

/**
 * @param level Log Level.
 * @param normalized Normalized Log.
 * @param options Options such as prefix and file output.
 * @returns 
 */
function output(level: LogLevel, normalized: NormalizedLog, options?: LogOptions) {
  if (!shouldLog(level)) return;
  
  const formatted = format(level, normalized.message, options?.emoji);

  if (normalized.stack) console.error(normalized.stack);

  writeToConsole(level, formatted);
  // writeToFile(level);
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
  info(message: string, options?: LogOptions) {
    output("info", normalize(message), options);
  },
  warn(message: string, options?: LogOptions) {
    output("warn", normalize(message), options);
  },
  error(err: Error | string, options?: LogOptions) {
    output("error", normalize(err), options);
  },
};