import type { Guild } from "discord.js";
import type { GuildOnboardingService } from "./service.js";

export class GuildOnBoardingUseCase {
  constructor(private service: GuildOnboardingService) {}

  async execute(guild: Guild) {
    await this.service.sendWelcomeMessage(guild);
  }
}
