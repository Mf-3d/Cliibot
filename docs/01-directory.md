# 🗂️ ディレクトリ構成

```
src/
├─ index.ts              # エントリーポイント
├─ client.ts             # Discord Clientの生成
│
├─ commands/             # スラッシュコマンド
│   ├─ ping.ts
│   └─ ranking.ts
│
├─ events/               # Discordイベント
│   ├─ ready.ts
│   ├─ messageCreate.ts
│   └─ interactionCreate.ts
│
├─ services/             # 外部連携・ロジック層
│   ├─ rankingService.ts
│   ├─ githubService.ts
│   └─ minecraftService.ts
│
├─ repositories/         # データ永続化
│   └─ activityRepository.ts
│
├─ models/               # 型・ドメイン定義
│   └─ UserActivity.ts
│
├─ utils/                # 汎用関数
│   ├─ logger.ts
│   └─ time.ts
│
├─ config/               # 設定
│   └─ env.ts
│
└─ types/                # 独自型定義
```