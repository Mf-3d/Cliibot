import { Client } from "discord.js";
import { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase";
import { Logger } from "@/utils/logger";

export function registerGuildCreateEvent(
  useCase: GuildOnBoardingUseCase,
  client: Client,
  logger: Logger,
) {
  client.on("guildCreate", (guild) => {
    logger.info(
      `🚢 The bot has been added to the server: ${guild.name} (${guild.id})`,
    );

    useCase.execute(guild);
  });
}
