import type { Logger } from "@mf-3d/logger";
import type { Client } from "discord.js";
import type { GuildOnBoardingUseCase } from "@/features/guildOnboarding/usecase.js";

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
