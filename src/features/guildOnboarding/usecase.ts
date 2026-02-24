import { Guild } from "discord.js";
import { GuildOnboardingService } from "./service";

export class GuildOnBoardingUseCase {
  constructor (private service: GuildOnboardingService) { }

  execute(guild: Guild) {
    this.service.sendWelcomeMessage(guild);
  }
}