# ChatGPT Discord BOT
[![CodeQL](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/codeql.yml)
[![OSSAR](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/ossar.yml)
[![Dependency Review](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml/badge.svg?branch=main)](https://github.com/itskdhere/ChatGPT-Discord-BOT/actions/workflows/dependency-review.yml)
<a href="https://discord.gg/vp7M9byhcv"><img alt="Discord" src="https://img.shields.io/discord/917792741054894131?color=%235865F2&label=Discord&logo=discord&logoColor=%23FFFFFF"></a>

### [***⚡ Join My Discord Server To Use/Test The Bot ⚡***](https://discord.gg/vp7M9byhcv)

A Discord BOT Powered By [OpenAI](https://openai.com/)'s [ChatGPT](https://chat.openai.com)

This BOT uses [ChatGPT-API v3](https://github.com/transitive-bullshit/chatgpt-api) , [Discord.JS v14](https://github.com/discordjs/discord.js) & [Puppeteer v19](https://github.com/puppeteer/puppeteer)

## ✨Features 
 🔥 Use slash command `/ask` to ask questions in any channel.
 
 💥 This uses **puppeteer** to automate the login process. Auto Solve CAPTCHA ✨
 
 🔑 Uses Single ChatGPT Conversation Thread per Session.
 
<!--🔑 Directly DM the bot to get answer/response privately, Send `reset` to start a new thread.(Disabled)-->

 ## 📡 Quick Start [Self-Hosting] 
### Requirements:
 - [Node.js v18](https://nodejs.org/)
 - [OpenAI Account](https://chat.openai.com/)
 - Atleast 1vCPU , 1GB RAM and 1GB Storage (For the **BOT Only**)

### Steps:
0. Create **New Application** [BOT] from [Discord Developer Portal](https://discord.com/developers/applications) and add this to your Discord Server with proper *Bot Permissions* and *Privileged Gateway Intents*.

1. `Star⭐` this Repo to get updates. 

2. [Download](https://github.com/itskdhere/ChatGPT-Discord-BOT/archive/refs/heads/main.zip) or, Clone this Repo:
```bash
git clone https://github.com/itskdhere/ChatGPT-Discord-BOT.git
```

3.  Install all dependencies: 
```bash
npm install
```

4. Rename the `.env.example` file to `.env` and fill the credentials properly. 

5. Start the BOT: 
```bash
npm run start
```
6. Complete the **CAPTCHA** Manually *or* [Use This Automation](https://github.com/transitive-bullshit/chatgpt-api#captchas)

7. Use the BOT 🎉


## ⛓Others
##### 📝 License: [MIT](https://github.com/itskdhere/ChatGPT-Discord-BOT/blob/main/LICENSE)
##### 🔋 ChatGPT API: [transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
##### 💡 Initial Inspiration:  [onury5506/Discord-ChatGPT-Bot](https://github.com/onury5506/Discord-ChatGPT-Bot)
