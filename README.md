# YearCal

年間カレンダーWebアプリ。1画面3×4グリッドで12ヶ月を表示し、各月に色付き予定を登録・管理できる。

## 構成

- **frontend/** — Vite + React + TypeScript + Tailwind CSS（GitHub Pages にデプロイ）
- **backend/** — Node.js + Express + SQLite（Railway にデプロイ）

## ローカル開発手順

### 1. バックエンド

```bash
cd backend
cp .env.example .env       # .env を編集してパスワードを設定
npm run dev                 # http://localhost:3001 で起動
```

### 2. フロントエンド

```bash
cd frontend
npm run dev                 # http://localhost:5173 で起動
```

## デプロイ

### フロントエンド（GitHub Pages）

1. GitHubにリポジトリを作成（例: `yearcal-web`）
2. Settings → Pages → Source を `GitHub Actions` に設定
3. Settings → Secrets → `VITE_API_BASE_URL` に Railway のバックエンドURL（例: `https://yearcal-web.up.railway.app/api`）を設定
4. `main` ブランチにpushすると自動デプロイ

### バックエンド（Railway）

1. [Railway](https://railway.app) でプロジェクト作成
2. `backend/` ディレクトリをデプロイ（または GitHub 連携）
3. 環境変数を設定:
   - `AUTH_USER` — ログインユーザー名
   - `AUTH_PASS` — ログインパスワード（強力なものを設定）
   - `PORT` — 自動設定（Railway が提供）
   - `DB_PATH` — `/data/yearcal.db`（Volume をマウントして永続化）
   - `CORS_ORIGIN` — GitHub Pages の URL（例: `https://yourusername.github.io`）
4. Volume を `/data` にマウント（DB の永続化）

## 認証

- フロントエンドのログイン画面でユーザー名・パスワードを入力
- `sessionStorage` に保存され、全APIリクエストに `Authorization: Basic` ヘッダーとして付与
- バックエンドで `express-basic-auth` により検証
