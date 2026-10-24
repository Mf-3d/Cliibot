// ドメインデータ
export type BotInfo = {
  name: string;
  usertag: string;
  version: string;
  author: string | string[];
  avatarUrl: string;
  uptime: number;
  links: { [key: string]: string };
};

// 表示用データ
export type AboutViewModel = {
  title: string;
  thumbnail: string;
  fields: { name: string; value: string, inline?: boolean }[];
  buttons: { name: string; url?: string; customId?: string }[];
};