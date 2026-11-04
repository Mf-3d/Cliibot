export interface GuildUserStatsRepository {
  incrementMessageCount(guildId: string, userId: string): Promise<void>;
  getRanking(
    guildId: string,
    limit: number,
  ): Promise<{ userId: string; limit: number }[]>;
}
