
<h1 align="center">
ChatGPT Discord BOT
</h1>

<p align="center">
<img src="https://github.com/itskdhere/ChatGPT-Discord-BOT/blob/main/ChatGPT.png">
</p>

<p align="center">
<a href="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml" title="CodeQL">
<img alt="CodeQL" src="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml/badge.svg?branch=main">
</a>
<a href="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml" title="OSSAR">
<img alt="OSSAR" src="https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml/badge.svg?branch=main">
</a>
</p>
<p align="center">
<a href="https://redirect.itskdhere.workers.dev/server/support/invite" title="Join Support Server"><img alt="Discord" src="https://img.shields.io/discord/917792741054894131?color=%235865F2&label=Join Support Server&logo=discord&logoColor=%23FFFFFF&style=for-the-badge"></a>
</p>

<!--
[![CodeQL](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml)
[![OSSAR](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml)
[![Dependency Review](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml) 
-->

A Discord BOT Powered By [OpenAI](https://openai.com/)'s [ChatGPT](https://chat.openai.com).

This BOT uses [ChatGPT-API v3](https://github.com/transitive-bullshit/chatgpt-api) , [Discord.JS v14](https://github.com/discordjs/discord.js) & [Puppeteer v19](https://github.com/puppeteer/puppeteer).

## ✨Features 
 🔥 Use slash command `/ask` to ask questions in any channel.
 
 ✨ ChatGPT onProgress Typing Effect. Chalk, Figlet & Gradient-String for decoration.

 💥 This uses **puppeteer** to automate the login process. Auto Solve CAPTCHA.
 
 🔑 Uses Single ChatGPT Conversation Thread per Session.
 
<!--🔑 Directly DM the bot to get answer/response privately, Send `reset` to start a new thread.(Disabled)-->

 ## 📡 Quick Start [Self-Hosting] 
### Requirements:
 - [Git](https://git-scm.com/)
 - [Node.js v18](https://nodejs.org/)
 - [Google Chrome](https://www.google.com/chrome/)
 - [OpenAI Account](https://chat.openai.com/)
 - Atleast 1vCPU , 0.5GB RAM and 0.5GB Storage for the Bot.

### Steps:
0. Create **New Application** [BOT] from [Discord Developer Portal](https://discord.com/developers/applications) and add this to your Discord Server with proper *Bot Permissions* and *Privileged Gateway Intents*.

1. `Star⭐` this Repo to get updates. 

2. Clone this Repo:
```bash
git clone https://github.com/itskdhere/ChatGPT-Discord-BOT
```
Then navigate to the Folder:
```bash
cd ChatGPT-Discord-BOT
```

3. Install all dependencies: 
```bash
npm install
```

4. Rename the `.env.example` file to `.env` and fill the credentials properly. 

5. Start the BOT: 
```bash
npm run start
```
- *or,* During development:
```bash
npm run dev
```

6. Complete the **CAPTCHA** Manually *or* [Use This Automation](https://github.com/transitive-bullshit/chatgpt-api/tree/v3#captchas).

7. Use the BOT 🎉


## ⛓Others
##### 📝 License: [MIT](https://github.com/itskdhere/ChatGPT-Discord-BOT/blob/main/LICENSE)
##### 🔋 ChatGPT API: [transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
##### 💡 Initial Inspiration:  [onury5506/Discord-ChatGPT-Bot](https://github.com/onury5506/Discord-ChatGPT-Bot)

<br>
<p align='center'>
--- 🙂 ---
</p>
