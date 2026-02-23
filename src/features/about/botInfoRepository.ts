export interface BotInfoRepository {
  getName(): string;
  getUsertag(): string;
  getVersion(): string;
  getAuthor(): string;
  getAvatarUrl(): string;
}