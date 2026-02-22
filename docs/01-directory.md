# 🗂️ ディレクトリ構成

```
src/
├─ main.ts               # エントリーポイント
├─ client.ts             # Discord Clientの生成
├─ env.ts                # 設定
│
├─ events/               # Discordイベント
│   ├─ ready.ts
│   ├─ messageCreate.ts
│   └─ interactionCreate.ts
│
├─ features/             # 機能
│   └─ about/
│       ├─ command.ts
│       ├─ service.ts
│       ├─ types.ts      # 独自型定義
│       ├─ models.ts     # 型・ドメイン定義
│       └─ formatter.ts
│
├─ utils/                # 汎用関数
│   ├─ logger.ts
│   └─ time.ts
│
└─ types/                # 汎用の型定義
```