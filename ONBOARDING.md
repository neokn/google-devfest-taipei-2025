
## 步驟
- [環境設置](#環境設置)
- [取得 Gemini API Key](#取得-Gemini-API-Key)
- [設定 Gemini API Key](#設定-Gemini-API-Key)
- [建立 Discord Bot](#建立-Discord-Bot)
- [設定 Discord Bot Token](#設定-Discord-Bot-Token)
- [將 Bot 加入你的 Server](#將-Bot-加入你的-Server)
- [啟動 Genkit + Discord](#啟動-Genkit--Discord)
- [開始對話](#開始對話)

## 環境設置

熟悉 Terminal 並且已經安裝 node.js 的朋友可以直接到 [快速上路](#快速上路) 看看

### 新手上路

#### VSCode
以下教學會以 VSCode 為範例
如果還沒有 VSCode 可以到 [VSCode](https://code.visualstudio.com/) 下載  
或是你想要試試 Google Antigravity 可以到 [Google Antigravity](https://antigravity.google/) 下載

#### 複製 Git 存放庫

> https://github.com/neokn/google-devfest-taipei-2025

![git clone](./assets/vscode-git-clone-url.png)

#### 安裝 Node.js

1. 先確認 node 是否已經安裝
點選右上角**切換面板**按鍵
確認有選在**終端機**
![vscode-terminal](./assets/vscode-terminal.png)
在終端機（Terminal）輸入 `node -v`

2. 如果沒有安裝

[Node.js](https://nodejs.org/zh-tw/download)

依照你的作業系統選擇對應的安裝檔

![nodejs-macos](./assets/nodejs-macos.png)

![nodejs-windows](./assets/nodejs-windows.png)

安裝後重新啟動 VSCode
再用 `node -v` 確認一次

#### 安裝套件

使用 `npm i` 安裝所需的套件
![npm install](./assets/vscode-npm-install.png)

#### 建立 .env

左側檔案列表中有一個 `template.env` 檔案  
請複製一份並重新命名為 `.env`
![vscode-dotnev](./assets/vscode-dotenv.png)

### 快速上路

專案兼容 `npm`, `pnpm`, `bun`
可以選自己習慣的

```bash
git clone https://github.com/neokn/google-devfest-taipei-2025.git
cd google-devfest-taipei-2025
npm i
cp template.env .env
```

## 取得 Gemini API Key

> **重要‼️ 重要‼️ 重要‼️**  
> 如果早上有取得 $5 抵免額 (credit) 的朋友請用相同的 Google 帳號操作以下步驟  
> 建議用**訪客模式/無痕模式**避免 Google AI Studio & GCP Console 切換過程帳號不一致
> ![GCP Credit](./assets/gcp-credit.png)

### 建立 API Key

打開 [Google AI Studio](https://aistudio.google.com/api-keys)

第一次進入的話等個 10 秒應該會自動建立一個 _Default Gemini Project_
![Default Gemini Project](./assets/google-ai-studio-gemini-default-project.png)

如果沒有也可以點右上的 **🔑 Create API Key**  
建立一個 Project 以及建立一個 API Key
![Create API Key](./assets/google-ai-studio-create-api-key.png)

### Set up billing

> **重要‼️ 重要‼️ 重要‼️**  
> 早上有完成取得 $5 抵免額 (credit) 的朋友再做這個步驟  
> 沒有申請的也沒關係  
> 這個 Workshop 用 Free Tier 還是夠用

複製 Project 底下的 ID
![Copy Project ID](./assets/google-ai-studio-copy-project-id.png)

把 ID 填入底下這個 URL
`https://console.cloud.google.com/billing/linkedaccount?project=YOUR_PROJECT_ID`

接著在瀏覽器打開並點擊 **連結帳單帳戶** 
![GCP Link Billing Account](./assets/gcp-link-billing-account.png)

選擇早上申請到的 $5 帳單帳戶
![Link Trial Billing Account](./assets/gcp-trial-billing-account.png)

回到 [Google AI Studio](https://aistudio.google.com/api-keys)
應該會看到原本的 _Free Tier_ 已經變為 _Tier 1_ 了
如果沒有的話過 10 秒後再更新一下網頁
![Google AI Studio Tier1](./assets/google-ai-studio-tier1.png)

## 設定 Gemini API Key

在 [Google AI Studio](https://aistudio.google.com/api-keys) 找到你建立的 API Key 點擊旁邊的複製按鈕
![Copy API Key](./assets/google-ai-studio-copy-key.png)

在 `.env` 檔案中將 `your_api_key` 替換成你複製的 API Key
```
GEMINI_API_KEY=your_api_key
```

## 建立 Discord Bot

> 相信大家早上應該都加入了 [Google for Developers Taiwan / Hong Kong](https://discord.gg/EfBRZk6Ejz) 的伺服器了  
> 所以大家應該都有 Discord 帳號了吧？如果還沒的話請趕快註冊一個吧！

### 新增一個伺服器

> 如果你已經擁有自己的伺服器可以跳過這個步驟

![New Server](./assets/discord-new-server.png)

![My Own](./assets/discord-new-server-my-own.png)

![Skip](./assets/discord-new-server-skip.png)

![Naming](./assets/discord-new-server-naming.png)

### 新增 Discord Bot

點擊 [建立 Discord Bot](https://discord.com/developers/applications?new_application=true)

![Create an application](./assets/discord-create-an-application.png)

![Discord Bot Message Content Intent](./assets/discord-bot-message-content-intent.png)

![Discord Bot Reset Token](./assets/discord-bot-reset-token.png)

![Copy Token](./assets/discord-bot-copy-token.png)

## 設定 Discord Bot Token

在 `.env` 檔案中將 `your_bot_token` 替換成你複製的 Bot Token
```
DISCORD_BOT_TOKEN=your_bot_token
```

## 將 Bot 加入你的 Server

複製 Client ID
![Discord OAuth2 Copy Client ID](./assets/discord-oauth2-copy-client-id.png)

將 Client ID 替換以下 URL 的 `YOUR_CLIENT_ID`  
`https://discord.com/oauth2/authorize?scope=bot&permissions=274877908992&integration_type=0&client_id=YOUR_CLIENT_ID`

將連結貼至瀏覽器
![Add to Server](./assets/discord-oauth2-add-to-server.png)

加入成功後會在 Server 中看到這樣的訊息
![Welcome](./assets/discord-bot-welcome.png)

## 啟動 Genkit + Discord

回到 VSCode 專案
在終端機執行
```bash
npm run dev
```

啟動成功的話應該會看到這樣的畫面
![Run Dev](./assets/vscode-npm-run-dev.png)

## 開始對話

可以用 `@` 來標記 Bot  
如果上述步驟都有成功 Bot 就會回話了！
![Hello World](./assets/discord-bot-hello-world.png)

## 切換分支

本工作坊會使用切換分支的方式來進行  
如果你對 git 不熟悉可以透過 VSCode 的切換分支功能  
在左下角的地方
![VSCode Switch Branch](./assets/vscode-git-switch-branch.png)
