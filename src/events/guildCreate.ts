import { Client } from "discord.js";
import { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase.js";
import { Logger } from "@/utils/logger/index.js";

export function registerGuildCreateEvent(
  useCase: GuildOnBoardingUseCase,
  client: Client,
  logger: Logger
) {
  client.on("guildCreate", async (guild) => {
    logger.info(`🚢 The bot has been added to the server: ${guild.name} (${guild.id})`);

    await useCase.execute(guild);
  });
}
