import dotenv from 'dotenv';
import { ChatGPTAPI, getOpenAIAuth, ChatGPTAPIBrowser } from 'chatgpt';
import axios from 'axios';
import { Client, Collection, GatewayIntentBits, REST, Routes, Partials, ChannelType, ActivityType } from 'discord.js';
import http from 'http';
import { exec } from 'child_process';
import Conversations from './conversations.js';

const MAX_RESPONSE_CHUNK_LENGTH = 1500
dotenv.config()

const commands = [
    {
        name: 'ask',
        description: 'Ask Anything!',
        options: [
            {
                name: "question",
                description: "Your question",
                type: 3,
                required: true
            }
        ]
    },
];

async function initChatGPT() {
    /* If you aren't using puppeteer, Un-comment the following & comment-out the block "This uses puppeteer" below*/
    // const sessionToken = process.env.SESSION_TOKEN
    // const clearanceToken = process.env.CLOUDFLARE_CLEARANCE_TOKEN
    // const userAgent = process.env.USER_AGENT
    // const openAIAuth = await getOpenAIAuth({
    //     email: process.env.OPENAI_EMAIL,
    //     password: process.env.OPENAI_PASSWORD
    // })
    // let api = new ChatGPTAPI({ sessionToken, clearanceToken, userAgent })
    // const api = new ChatGPTAPI({ ...openAIAuth })
    // await api.ensureAuth()


    /* This uses puppeteer */
    const api = new ChatGPTAPIBrowser({
        email: process.env.OPENAI_EMAIL,
        password: process.env.OPENAI_PASSWORD
    })
    await api.initSession()
    /* _ */


    return {
        sendMessage: (message, opts = {}) => {
            return api.sendMessage(message, opts)
        },
        getConversation(opts = {}) {
            return api.getConversation(opts)
        }
    };
}

async function initDiscordCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    const chatGTP = await initChatGPT().catch(e => {
        console.error(e)
        process.exit()
    })

    await initDiscordCommands().catch(e => { console.log(e) })

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel]
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log('Connected to Discord Gateway');
        console.log(new Date())
    });

    client.once('ready', () => {
        client.user.setStatus('online');
        //client.user.setActivity('ChatGPT', { type: ActivityType.Watching });
        client.user.setActivity('/ask');
    });


    function askQuestion(question, cb, opts = {}) {

        const { conversationInfo } = opts

        let tmr = setTimeout((e) => {
            cb("Oppss, something went wrong! (Timeout)")
            console.error(e)
        }, 45000)

        if (conversationInfo) {
            let conversation = chatGTP.getConversation({
                conversationId: conversationInfo.conversationId,
                parentMessageId: conversationInfo.parentMessageId
            })

            conversation.sendMessage(question).then(response => {
                conversationInfo.conversationId = conversation.conversationId
                conversationInfo.parentMessageId = conversation.parentMessageId
                clearTimeout(tmr)
                cb(response)
            }).catch((e) => {
                cb("Oppss, something went wrong! (Error)")
                console.error(e)
            })
        } else {
            chatGTP.sendMessage(question).then((response) => {
                clearTimeout(tmr)
                cb(response)
            }).catch((e) => {
                cb("Oppss, something went wrong! (Error)")
                console.error(e)
            })
        }
    }

    async function splitAndSendResponse(resp, user) {
        while (resp.length > 0) {
            let end = Math.min(MAX_RESPONSE_CHUNK_LENGTH, resp.length)
            await user.send(resp.slice(0, end))
            resp = resp.slice(end, resp.length)
        }
    }

    client.on("messageCreate", async message => {
        if (process.env.ENABLE_DIRECT_MESSAGES !== "true" || message.channel.type != ChannelType.DM || message.author.bot) {
            return;
        }
        const user = message.author

        console.log("----Direct Message---")
        console.log("Date    : " + new Date())
        console.log("UserId  : " + user.id)
        console.log("User    : " + user.tag)
        console.log("Message : " + message.content)
        console.log("--------------")

        if (message.content == "reset") {
            Conversations.resetConversation(user.id)
            user.send("Who are you ?")
            return;
        }

        let conversationInfo = Conversations.getConversation(user.id)
        try {
            let sentMessage = await user.send("Hmm, let me think...")
            askQuestion(message.content, async (response) => {
                console.log('Response: ')
                console.log(response)
                if (response.length >= MAX_RESPONSE_CHUNK_LENGTH) {
                    splitAndSendResponse(response, user)
                } else {
                    await sentMessage.edit(response)
                }
            }, { conversationInfo })
        } catch (e) {
            console.error(e)
        }
    })

    client.on("interactionCreate", async interaction => {
        const question = interaction.options.getString("question")
        console.log('Question: ' + question)
        try {
            await interaction.reply({ content: "let me think..." })
            askQuestion(question, async (content) => {
                console.log('Response: ')
                console.log(content)
                if (content.length >= MAX_RESPONSE_CHUNK_LENGTH) {
                    await interaction.editReply({ content: "The answer to this question is very long, so I will answer by dm." })
                    splitAndSendResponse(content.response, interaction.user)
                } else {
                    await interaction.editReply( content.response )
                }
            })
        } catch (e) {
            console.error(e)
        }

    });

    client.login(process.env.DISCORD_BOT_TOKEN).catch(console.log);
}

main()

// Auto-Run 24/7 & Debug -----------------------------------
// http.createServer((req, res) => res.end('BOT is Up & Running..!!')).listen(80);
/*
setInterval(() => {
    axios
        .get('https://discord.com/api/v10')
        .catch(error => {
            if (error.response.status == 429) {
                exec('kill 1', (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            }
        });

}, 10000);
*/
