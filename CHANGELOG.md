# Changelog

## 2026-04-24

### 概要
- ログイン導線、プロフィール管理、ToDo管理、モバイルUI改善を段階的に実装・調整。
- 安定性優先で、ToDoは最終的に `localStorage` 管理の仕様に戻し、追加できない不具合を解消。

### 主要変更
- **認証フロー**
  - ログイン画面を追加し、ログイン成功時にプロフィール選択へ遷移。
  - セッションCookieによるログイン判定とログアウトを実装。
  - プロフィール関連ページは未ログイン時にログイン画面へリダイレクト。

- **プロフィール機能**
  - プロフィール選択画面、プロフィール新規登録画面、プロフィール詳細画面の導線を整理。
  - 既存プロフィールの編集・削除は詳細画面の `edit/delete` セクションに集約。
  - `edit/delete` セクションは常時表示ではなく、開閉ボタンで表示する仕様に変更。
  - 2人目プロフィールを「林 さくら」内容へ更新。
  - さくら専用画像 `public/images/sakura_profile.png` を反映。

- **ToDo機能**
  - プロフィールごとにToDoを分離（保存キーをプロフィールID単位に分割）。
  - 追加・削除・メモ編集・完了/未完了切替をサポート。
  - DB管理化の土台（`todos` テーブル定義、APIルート、マイグレーション）を追加。
  - ただし運用安定のため、UIは現時点で `localStorage` 管理に戻している。

- **UI/UX（Tailwind + レスポンシブ）**
  - 共通UIクラス（`ui-card`, `ui-btn-primary`, `ui-input` など）を導入しデザイン統一。
  - スマホ向けにヘッダー開閉メニューを追加。
  - 下部固定ナビ（Top / About / To Do / edit-delete）を追加。
  - ToDoテーブル操作列の崩れ、フォーム縦積み、余白最適化を実施。

### バグ修正・安定化
- **Hydration Error** を修正。
  - 原因: 初回レンダーで `localStorage` を直接読み、サーバーHTMLとクライアントHTMLが不一致。
  - 対策: 初回は `baseProfiles` で描画し、`useEffect` 後に `loadProfiles` を反映。

- **Next.js 404（APIルート）** を修正。
  - 原因: `src/app/api` のみ作成していたため、`app/` 優先構成でルートが拾われないケースが発生。
  - 対策: `app/api/...` に re-export ルートを追加し、`/api/todos` と `/api/todos/[id]` を有効化。

- **プロフィール保存内容が戻る問題** を修正。
  - 原因: `ayaka -> さくら` 移行ロジックが毎回適用され、編集値を上書き。
  - 対策: 旧データ判定時のみ移行を行うよう変更。

### 確認済み
- `npm run lint`
- `npm run build`
- `npm run db:migrate`（ローカル環境）

## 2026-04-25（b8e1638 以降の更新）

### 概要
- プロフィールとToDoのデータ管理を、画面内のローカル状態中心から **API + PostgreSQL中心** に再整理。
- Hydration エラーの出やすい構成を避け、サーバー取得データを初期表示に使う形へ移行。

### 追加・変更点（前回push以降）
- **プロフィールをDB管理へ移行**
  - `profiles` テーブルを追加（`id`, `name`, `image_path`, `role`, `age`, `catch_copy`, `about`, `tags`, `sort_order` など）。
  - マイグレーション追加: `drizzle/0002_condemned_thor_girl.sql`
  - `src/features/profile/profile-service.ts` を追加し、初回シード + 取得ロジックを集約。
  - 画面側は `getProfiles()` / `getProfile()` でサーバーから取得する構成に変更。

- **プロフィールAPIを追加**
  - `GET /api/profiles`（一覧）
  - `POST /api/profiles`（新規作成）
  - `PATCH /api/profiles/[id]`（更新）
  - `DELETE /api/profiles/[id]`（削除）
  - `app/api/profiles/...` に re-export ルートを追加し、`app/` 優先構成でも確実に解決されるよう調整。

- **ToDoをDB API運用へ再切替**
  - `TodoManagementTable` を API 連携方式に更新。
  - `GET /api/todos?profileId=...` で読み込み、`POST/PATCH/DELETE /api/todos...` で更新。
  - 表示IDは UUID の代わりに一覧No.（1,2,3...）で表示して可読性を改善。

- **画面別の挙動改善**
  - プロフィール選択画面: カードごとに削除ボタンを追加。
  - プロフィール新規登録画面: API経由の登録に変更、登録中状態を表示。
  - プロフィール詳細画面: API経由の更新/削除に変更し、更新後 `router.refresh()` で即反映。

### 技術的な改善ポイント
- 初期表示にサーバー取得データを使うことで、クライアント依存値（`localStorage`）による
  SSR/CSR差分を抑制し、Hydration mismatch の再発リスクを低減。
- APIルートを `app/api` で露出させることで、`src/app/api` 単体配置による404系トラブルを予防。

### 確認済み
- `npm run lint`
- `npm run build`
