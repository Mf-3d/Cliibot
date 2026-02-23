import { LOG_LEVEL_PRIORITY, LogLevel } from "./levels";
import { Formatter } from "./formatter";
import { Writer, ConsoleWriter, FileWriter } from "./writer";
import { NormalizedLog, Normalizer } from "./normalizer";

export class Logger {
  private currentLogLevel: LogLevel = "info";
  private normalizer: Normalizer;
  private formatter: Formatter;
  private writers: Writer[];

  constructor () {
    this.normalizer = new Normalizer();
    this.formatter = new Formatter();
    this.writers = [
      new ConsoleWriter(),
      new FileWriter()
    ];
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

    const formatted = this.formatter.format(level, normalized.stack ?? normalized.message);
    this.writers.forEach(writer => writer.write(level, formatted));
  }

  info (message: string) {
    this.output("info", this.normalizer.normalize(message));;
  }

  warn (message: string) {
    this.output("warn", this.normalizer.normalize(message));;
  }

  error (message: string | Error) {
    this.output("error", this.normalizer.normalize(message));;
  }
}