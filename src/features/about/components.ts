import {
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  ThumbnailBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js";
import { AboutViewModel } from "./types";

/**
 * @param view 表示用にフォーマットされたボットの情報
 * @returns
 */
export function buildComponents(view: AboutViewModel) {
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
      Object.values(view.buttons)
        .filter((item) => item.url)
        .map((item) =>
          new ButtonBuilder()
            .setLabel(item.name)
            .setURL(item.url!)
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