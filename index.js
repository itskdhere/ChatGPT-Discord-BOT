/* -:Environment Variables:-
 ENABLE_DIRECT_MESSAGES=false
 DISCORD_CLIENT_ID
 USER_AGENT
 DISCORD_BOT_TOKEN
 CLOUDFLARE_CLEARANCE_TOKEN
 SESSION_TOKEN
*/
import dotenv from 'dotenv';
import { ChatGPTAPI } from 'chatgpt';
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
    const sessionToken = process.env.SESSION_TOKEN
    const clearanceToken = process.env.CLOUDFLARE_CLEARANCE_TOKEN
    const userAgent = process.env.USER_AGENT

    let api = new ChatGPTAPI({ sessionToken , clearanceToken ,  userAgent})

    // await api.ensureAuth()

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

    await initDiscordCommands()

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

        let tmr = setTimeout(() => {
            cb("Oppss, something went wrong! (Timeout)")
        }, 100000)

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
            }).catch(() => {
                cb("Oppss, something went wrong! (Error)")
            })
        } else {
            chatGTP.sendMessage(question).then((response) => {
                clearTimeout(tmr)
                cb(response)
            }).catch(() => {
                cb("Oppss, something went wrong! (Error)")
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
        console.log("User    : " + user.username)
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
        try {
            await interaction.reply({ content: "let me think..." })
            askQuestion(question, async (content) => {
                if (content.length >= MAX_RESPONSE_CHUNK_LENGTH) {
                    await interaction.editReply({ content: "The answer to this question is very long, so I will answer by dm." })
                    splitAndSendResponse(content, interaction.user)
                } else {
                    await interaction.editReply({ content })
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
http.createServer((req, res) => res.end('BOT is Up & Running..!!')).listen(80);

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