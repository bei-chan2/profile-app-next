# Template

個人開発向けに、Next.js + TypeScript + PostgreSQL + Azure を前提とした Web アプリ基盤です。  
将来的な CRUD、認証、API 実装を追加しやすいように、`src` 配下で責務を分離しています。

## 技術スタック
- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- PostgreSQL
- Drizzle ORM / Drizzle Kit
- Zod
- Azure Container Apps（デプロイ先想定）

## ディレクトリ構成
```txt
src/
  app/         # 画面 / Route Handlers
  components/  # 共通 UI
  features/    # 機能単位の実装
  lib/         # 共通関数（env validation など）
  db/          # DB 接続 / schema
  types/       # 型定義
drizzle/       # 生成される migration 出力先
```

## セットアップ
1. 依存関係をインストール
```bash
npm install
```

2. 環境変数を作成
```bash
cp .env.example .env
```

3. 必要に応じて `DATABASE_URL` などを更新

4. 開発サーバーを起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## 立ち上げ方（ローカル）
最短で立ち上げる場合は以下の順番です。

1. PostgreSQL を起動（ローカル or Docker）
2. `.env` の `DATABASE_URL` を接続先に合わせる
3. 初回のみマイグレーション適用
```bash
npm run db:migrate
```
4. アプリ起動
```bash
npm run dev
```

## DB 更新手順（Drizzle）
スキーマ変更時は、毎回この手順で更新します。

1. `src/db/schema.ts` を編集
2. マイグレーション SQL を生成
```bash
npm run db:generate
```
3. DB に適用
```bash
npm run db:migrate
```
4. 必要に応じて Drizzle Studio で確認
```bash
npm run db:studio
```

## DB 関連コマンド
```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## 品質確認コマンド
```bash
npm run lint
npm run build
```

## Azure Container Apps デプロイ方針
- `next.config.ts` で `output: "standalone"` を有効化済み
- ルートの `Dockerfile` は Azure Container Apps で利用しやすい multi-stage 構成
- 実運用時は Azure 側で環境変数（`DATABASE_URL`, `AUTH_SECRET` など）を設定

## 認証の拡張ポイント
- Auth.js 実装を `src/features/auth` に集約する想定
- 事前に `AUTH_URL`, `AUTH_SECRET` を `.env` / Azure の設定へ追加可能
