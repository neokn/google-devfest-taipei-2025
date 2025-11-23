# google-devfest-taipei-2025

## 簡介

想快速打造 AI ChatBot 應用？
Firebase Genkit 讓開發 LLM 應用變得優雅又高效。

本 Workshop 用 Genkit + Gemini 打造 AI ChatBot
展示 GenKit 如何解決實際痛點
- dotPrompt 讓 Prompt 管理不再是技術債
- Developer UI 讓調教過程視覺化
- Flow 設計讓複雜邏輯模組化
- 內建 Trace 讓除錯超簡單

你將學到：
- Genkit 的核心概念與開發體驗
- dotPrompt 的版本控制最佳實踐
- 如何利用 Genkit 加速你的 model 選擇以及 prompt tuning

此 Workshop 將以 Discord Bot 為例
請事先確認已經有 Discord 帳號

## 前置需求

- Node.js (LTS 22 or 24)
- pnpm (**推薦**)
- Gemini API Key
- Discord Bot Token

## 設定步驟

1. 複製此專案

```bash
git clone https://github.com/neokn/google-devfest-taipei-2025.git
```

2. 建立 .env 檔案

```bash
cp .env.example .env
```

3. 在 .env 檔案中填入 Gemini API Key

```bash
GEMINI_API_KEY=your_api_key
```

4. 安裝依賴套件

```bash
pnpm install
```

5. 啟動應用程式

```bash
pnpm run dev
```
