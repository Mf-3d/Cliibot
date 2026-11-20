import { Guild } from "discord.js";
import { GuildOnboardingService } from "./service";

export class GuildOnBoardingUseCase {
  constructor(private service: GuildOnboardingService) {}

  async execute(guild: Guild) {
    await this.service.sendWelcomeMessage(guild);
  }
}
