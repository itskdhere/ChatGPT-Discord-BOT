
<h1 align="center">
ChatGPT Discord BOT
</h1>

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
### 0. Requirements:
 - [Git](https://git-scm.com/)
 - [Node.js v18](https://nodejs.org/)
 - [OpenAI Account](https://chat.openai.com/)
 - [Discord Account](https://discord.com/)
 - [Google Account](https://accounts.google.com/) For [Firebase](https://firebase.google.com/)
 - Atleast 1vCPU , 0.25GB RAM & 0.5GB Storage for the Bot.

### 1. Bot Setup:
0. Create **New Application** (BOT) from [Discord Developer Portal](https://discord.com/developers/applications) and add this to your Discord Server with:<br>
**Scopes:** `bot` & `application.commands` <br>
**Bot Permissions:** `2734284602433` <br>
**Privileged Gateway Intents:** `PRESENCE`, `SERVER MEMBERS`, `MESSAGE CONTENT` 

1. `Star⭐` this Repo to get updates. 

2. Clone this repo:
```bash
git clone https://github.com/itskdhere/ChatGPT-Discord-BOT
```
Then navigate to the folder:
```bash
cd ChatGPT-Discord-BOT
```

3. Install all dependencies: 
```bash
npm install
```

4. To setup Environment Variables, Create a `.env` file in the root directory ***or*** Rename the `.env.example` file to `.env`. Then fill the credentials properly by following [this instruction](https://github.com/itskdhere/ChatGPT-Discord-BOT#2-environment-variables-setup).

5. Setup Firebase Firestore Database by following [this instruction](https://github.com/itskdhere/ChatGPT-Discord-BOT#3-database-setup).

6. Start the BOT: 
```bash
npm run start
```
*Or,* During Development:
```bash
npm run dev
```
*Or,* In Production:
```bash
npm run prod
```

7. Use the BOT 🎉

### • Environment Variables Setup:

- `DISCORD_CLIENT_ID` - Client ID of the bot from *OAuth2* section.

- `DISCORD_BOT_TOKEN` - Token of the bot from *Bot* section.

- `DIRECT_MESSAGES` - true/false

- `DM_WHITELIST_ID=[ "id_1" , "id_2" ]` - Set Discord user IDs of users only who can use bot from dm. You can add as many as you want in proper format.

- `OPENAI_API_KEY` - Get OpenAI API Key from [here](https://platform.openai.com/account/api-keys).

- `DISCORD_MAX_RESPONSE_LENGTH` - Max *2000* , recomended *1900*.

- `API_ENDPOINT` - Set `default` for *api.openai.com* endpoint. But you can set 3rd party equivalent endpoint too.

- `DEBUG` - true/false

- `UWU` - true/false

> See [.env.example](https://github.com/itskdhere/ChatGPT-Discord-BOT/blob/main/.env.example) file for more details

### • Database Setup:

 0. Goto **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com/) (Card Not Required)

 1. Click on `Create a project` or `Add project`. Give it a name and click `Continue`.

 2. Disable Google Analytics & Click `Create Project`.

 3. From the side-bar goto `Build` & then `Firestore Database`.

 4. Click `Create Database`.

 5. Select `Start in production mode` & click `Next`.

 6. Select a Firestore location nearest to your Server / VPS. This'll also set the Default GCP Resource Location & you can't change it later. <br> Then click `Enable`.

 7. Now goto `Project settings` & `Service accounts`.

 8. Under `Firebase Admin SDK` select `Node.js`. Then click `Generate new private key` and then click `Generate key`.

 9. **Important:** Rename the downloaded json file to `firebaseServiceAccountKey.json` . Any other name will not work here. Then put the json file in your bots directory.

> ✨ Tip: check out these images [here](https://github.com/itskdhere/ChatGPT-Discord-BOT/tree/main/img)

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
