import {
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  EmbedBuilder,
  ThumbnailBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js";
import { AboutViewModel, BotInfo } from "./types";

/**
 * @param info ボット情報
 * @returns
 */
export function formatBotInfo(info: BotInfo): AboutViewModel {
  return {
    title: `📄 About ${info.name}`,
    thumbnail: info.avatarUrl,
    fields: [
      { name: "Username", value: info.usertag, inline: true },
      { name: "Version", value: info.version, inline: true },
      {
        name: "Author",
        value:
          typeof info.author === "string" ? info.author : info.author.join(","),
        inline: true,
      },
      { name: "Uptime", value: formatUptime(info.uptime), inline: true },
    ],
    buttons: Object.entries(info.links).map(([name, url]) => ({ name, url })),
  };
}

/**
 * @param uptime アップタイムの秒数
 */
function formatUptime(uptime: number): string {
  let sec = Math.floor(uptime % 60);
  let min = Math.floor((uptime % 3600) / 60);
  let hr = Math.floor((uptime % 86400) / 3600);
  let day = Math.floor(uptime / 86400);

  let result = [
    formatUnit(day, "day"),
    formatUnit(hr, "hour"),
    formatUnit(min, "minute"),
    formatUnit(sec, "second"),
  ]
    .filter(Boolean)
    .join(" ");

  return result || "0 seconds";
}

function formatUnit(value: number, unit: string): string | null {
  if (value === 0) return null;
  return value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;
}

/**
 * @param view 表示用にフォーマットされたボットの情報
 * @returns
 * @deprecated
 */
export function toEmbed(view: AboutViewModel) {
  return new EmbedBuilder()
    .setTitle(view.title)
    .setThumbnail(view.thumbnail)
    .addFields(view.fields)
    .setTimestamp()
    .setColor("#2e77ff");
}

/**
 * @param view 表示用にフォーマットされたボットの情報
 * @returns
 */
export function toComponents(view: AboutViewModel) {
  const container = new ContainerBuilder();

  // Add title
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`## ${view.title}`),
  );

  // Add thumbnail and fields in a section
  container.addSectionComponents(
    new SectionBuilder()
      // Add fields
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          view.fields
            .map((field) => `**${field.name}**: ${field.value}`)
            .join("\n"),
        ),
      )
      // Add thumbnail
      .setThumbnailAccessory(new ThumbnailBuilder().setURL(view.thumbnail)),
  );

  // Add a separator
  container.addSeparatorComponents(
    new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Large),
  );

  // Add link buttons
  container.addActionRowComponents(
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      Object.entries(view.buttons).map(([_, item]) =>
        new ButtonBuilder()
          .setLabel(item.name)
          .setURL(item.url ?? "")
          .setStyle(ButtonStyle.Link),
      ),
    ),
  );

  container.addTextDisplayComponents([
    new TextDisplayBuilder().setContent(
      `-# <t:${Math.floor(Date.now() / 1000)}:s>`,
    ),
  ]);

  container.setAccentColor([46, 119, 255]);

  return container;
}
