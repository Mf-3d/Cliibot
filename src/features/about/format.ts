import { EmbedBuilder } from "discord.js";
import { AboutViewModel, BotInfo } from "./types";

/**
 * @param info ボット情報
 * @returns 
 */
export function formatBotInfo (info: BotInfo): AboutViewModel {
  return {
    title: `📄 About ${info.name}`,
    thumbnail: info.avatarUrl,
    fields: [
      { name: "Username", value: info.usertag, inline: true },
      { name: "Version", value: info.version, inline: true },
      { name: "Author", value: typeof info.author === "string" ? info.author : info.author.join(","), inline: true },
      { name: "Uptime", value: formatUptime(info.uptime), inline: true }
    ]
  };
}

/**
 * @param uptime アップタイムの秒数
 */
function formatUptime (uptime: number): string {
  let day = Math.floor(uptime / 86400);
  let hr = Math.floor((uptime % 86400) / 3600);
  let min = Math.floor((uptime % 3600) / 60);
  let sec = Math.floor(uptime % 60);

  return `${day}d ${hr}h ${min}m ${sec}s`
}

/**
 * @param view 表示用にフォーマットされたボットの情報
 * @returns 
 */
export function toEmbed (view: AboutViewModel) {
  return new EmbedBuilder()
  .setTitle(view.title)
  .setThumbnail(view.thumbnail)
  .addFields(view.fields)
  .setTimestamp();
}