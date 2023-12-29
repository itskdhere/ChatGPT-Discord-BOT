<h1 align="center">
ChatGPT Discord BOT
</h1>

<h3 align="center">
<b>v3.2.4</b>
</h3>

<p align="center">
<img src="img/ChatGPT.svg">
</p>

<p align="center">
<a href="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml" title="CodeQL">
<img alt="CodeQL" src="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml/badge.svg?branch=main">
</a>
<a href="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml" title="OSSAR">
<img alt="OSSAR" src="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml/badge.svg?branch=main">
</a>
<a href="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml" title="Dependency Review">
<img alt="Dependency Review" src="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml/badge.svg">
</a>
</p>

<p align="center">
<a href="https://redirect.itskdhere.workers.dev/server/support/invite" title="Join Support Server"><img alt="Discord" src="https://img.shields.io/discord/917792741054894131?color=%235865F2&label=Chat&logo=discord&logoColor=%23FFFFFF&style=for-the-badge"></a>
</p>

----
<!--
[![CodeQL](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml)
[![OSSAR](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml)
[![Dependency Review](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml) 
-->

A Discord BOT Powered By [OpenAI](https://openai.com/)'s [ChatGPT](https://chat.openai.com).

This BOT uses [ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api) & [Firebase](https://firebase.google.com/) [Firestore Database](https://firebase.google.com/docs/firestore).

## ✨Features 
 🔥 Use slash command `/ask` to ask questions in any channel.
 
 🔑 Direct Message (DM) the bot to get answer / response privately (switchable).

 🧵 Continue Conversation in DM or using `/ask`
 
 🔄 Use `/reset-chat` to Start a new Conversation / Thread.

 💥 Uses Firestore Database for persistent chat history storage & logs.

 ✨ Chalk, Figlet & Gradient-String for decoration.

 💫 Easy Setup !
 
## 🥏 Usage:

 - `DM` - Ask Anything.

 - `/ask` - Ask Anything.
 
 - `/help` - Get Help.

 - `/ping` - Check Websocket Heartbeat && Roundtrip Latency.

 - `/reset-chat` - Start A Fresh Chat Session/Thread.


## 📡 Quick Start [Self-Hosting] :
### Requirements:
 - [Git](https://git-scm.com/)
 - [Node.js v20](https://nodejs.org/) or, [Docker](https://www.docker.com/)
 - [OpenAI Account](https://chat.openai.com/)
 - [Discord Account](https://discord.com/)
 - [Google Account](https://accounts.google.com/) For [Firebase](https://firebase.google.com/)
 - Atleast 1vCPU , 0.5GB RAM & 1GB Storage for the Bot.

### Setting Up The Bot:
0. Create **New Application** (BOT) from [Discord Developer Portal](https://discord.com/developers/applications) and invite that bot to your Discord Server with:<br>
**Scopes:** `bot` & `application.commands` <br>
**Bot Permissions:** `2734284602433` <br>
**Privileged Gateway Intents:** `PRESENCE`, `SERVER MEMBERS`, `MESSAGE CONTENT` <br>
- **Example Bot Invite URL** (Replace `BOT_CLIENT_ID` with your bot's Client ID) **:**
```
https://discord.com/api/oauth2/authorize?client_id=BOT_CLIENT_ID&permissions=2734284602433&scope=bot%20applications.commands
```

1. `⭐Star` this Repo to get updates. 

2. Clone this repo:
```bash
git clone https://github.com/itskdhere/ChatGPT-Discord-BOT
```
Then navigate to the folder:
```bash
cd ChatGPT-Discord-BOT
```

3. To setup Environment Variables, Copy & Rename the `.env.example` file to `.env` and open in any Text Editor. Then, fill the credentials properly by following this instruction:

<details>
<summary><b>Expand / Collapse Instruction</b></summary>

- `DISCORD_CLIENT_ID` - Client ID of the bot from *OAuth2* section.

- `DISCORD_BOT_TOKEN` - Token of the bot from *Bot* section.

- `DIRECT_MESSAGES` -  Toggle Direct Messages. **Values:** `true` or `false`

- `DM_WHITELIST_ID=[ "id_1" , "id_2" ]` - Set Discord user IDs of users only who can use bot from dm. You can add as many as you want in proper format.

- `OPENAI_API_KEY` - Get OpenAI API Key from [here](https://platform.openai.com/account/api-keys).

- `HTTP_SERVER` - HTTP Server (Optional). Values: `true` or `false`
- `PORT` - Port for HTTP Server. Default: `7860`.

#### **• Advanced Settings:**

- `DISCORD_MAX_RESPONSE_LENGTH` - Max *2000* , recomended *1900*.

- `API_ENDPOINT` - Set `default` for *api.openai.com* endpoint. But you can set 3rd party equivalent endpoint too.

- `DEBUG` - Toggle Debug Messages. **Values:** `true` or `false`

- `UWU` - Toggle Figlet & Gradient-String decoration. **Values:** `true` or `false`

- `MODEL` - Name of the Model you want to use. Like, `text-davinci-003` , `gpt-3.5-turbo` , `gpt-4` etc.

- `SYSTEM_MESSAGE` - This is the Initial Prompt that is sent to the Model. You can change it to anything you want to change the bot's behaviour as your requirements. Knowledge Cutoff and Current Date is always sent.

> See [.env.example](https://github.com/itskdhere/ChatGPT-Discord-BOT/blob/main/.env.example) file for more details

</details>

<br>

4. Setup Firebase Firestore Database by following this instruction:

<details>
<summary><b>Expand / Collapse Instruction</b></summary>

 0. Goto **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com/) (No Card Required)

 1. Click on `Create a project` or `Add project`. Give it a name and click `Continue`

 2. Disable Google Analytics & Click `Create Project`

 3. From the side-bar goto `Build` & then `Firestore Database`.

 4. Click `Create Database`

 5. Select `Start in production mode` & click `Next`

 6. Select a Firestore location nearest to your Server / VPS. This'll also set the Default GCP Resource Location & you can't change it later. <br> Then click `Enable`

 7. Now goto `Project settings` & `Service accounts`.

 8. Under `Firebase Admin SDK` select `Node.js`. Then click `Generate new private key` and then click `Generate key`

 9. **Important:** Rename the downloaded json file to `firebaseServiceAccountKey.json` <br> Any other name will not work here. Then put the json file in your bots directory. <br>Copy FileName:
 ```bash
 firebaseServiceAccountKey.json
 ```

> ✨ Tip: check out these images [here](https://github.com/itskdhere/ChatGPT-Discord-BOT/tree/main/img)

</details>

### Running The Bot:

#### **🐳 Using Docker:**

```bash
docker build -t itskdhere/chatgpt:3.2.4 .
```
```bash
docker run -d -p 7860:7860 --env-file .env -v ./firebaseServiceAccountKey.json:/app/firebaseServiceAccountKey.json --name chatgpt itskdhere/chatgpt:3.2.4
```

#### **🐳 Using Docker Compose:**

```bash
docker compose build
```
```bash
docker compose up -d
```

#### **🟢 Without Docker:**

1. Install all dependencies: 
```bash
npm install
```

2. Start the BOT: 
```bash
npm run start
```
*Or,* During Development:
```bash
npm run dev
```
*Or,* In Production with [PM2](https://pm2.keymetrics.io/docs/usage/quick-start):
```bash
npm install pm2 -g
```
```bash
npm run prod
```

## 💬 Support:

- [Discord Server](https://redirect.itskdhere.workers.dev/server/support/invite)
- [Create Issue](https://github.com/itskdhere/ChatGPT-Discord-BOT/issues/new)

## ⛓ Others:
#### 📝 License: [MIT](https://github.com/itskdhere/ChatGPT-Discord-BOT/blob/main/LICENSE)
#### 🔋 ChatGPT API: [transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
#### 📚 Database: [Firestore](https://firebase.google.com/docs/firestore)
#### 🌐 BaaS: [Firebase](https://firebase.google.com/)
#### ☁ IaaS: [Google Cloud Platform](https://cloud.google.com/)

<br>
<p align='center'>
--- 🙂 ---
</p>
