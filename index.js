// Imports
import dotenv from 'dotenv'; dotenv.config();
import { ChatGPTAPIBrowser } from 'chatgpt';
import { Client, Collection, ChannelType, GatewayIntentBits, REST, Routes, Partials, ActivityType } from 'discord.js';
import axios from 'axios';

// Defines
const MAX_RESPONSE_LENGTH = 2000 // Discord Max 2000 Characters
let res; // ChatGPT Thread Identifier

// Discord Slash Commands Defines
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
    {
        name: 'ping',
        description: 'Check Websocket Heartbeat & Roundtrip Latency'
    }
];

// Initialize OpenAI Session & New ChatGPT Thread
async function initOpenAI() {
    const api = new ChatGPTAPIBrowser({
        email: process.env.OPENAI_EMAIL,
        password: process.env.OPENAI_PASSWORD
      //isGoogleLogin: true
    })

    await api.initSession();

    return api;
}

// Initialize Discord Application Commands
async function initDiscordCommands(api) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    res = await api.sendMessage('Hi'); // Init New Thread
}

// Main Function (Execution Starts Here)
async function main() {
    const chatGTP = await initOpenAI().catch(error => {
        console.error(error)
        process.exit()
    })

    await initDiscordCommands(chatGTP).catch(e => { console.log(e) });

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

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log('Connected to Discord Gateway');
        console.log(new Date())
        client.user.setStatus('online');
        client.user.setActivity('/ask');
    });

    // Channel Message Handler
    client.on("interactionCreate", async interaction => {
        if (!interaction.isChatInputCommand()) return;

        client.user.setActivity(interaction.user.tag, { type: ActivityType.Watching });

        switch (interaction.commandName) {
            case "ask":
                ask_Interaction_Handler(interaction)
                break;
            case "ping":
                ping_Interaction_Handler(interaction)
                break;
            default:
                await interaction.reply({ content: 'Command Not Found' });
        }
    });

    async function ping_Interaction_Handler(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Websocket Heartbeat: ${interaction.client.ws.ping} ms. \nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp} ms`);
    }

    async function ask_Interaction_Handler(interaction) {
        const question = interaction.options.getString("question");

        console.log("----------Channel Message--------");
        console.log("Date & Time : " + new Date());
        console.log("UserId      : " + interaction.user.id);
        console.log("User        : " + interaction.user.tag);
        console.log("Question    : " + question);
        // TODO: send to DB
        try {
            await interaction.reply({ content: "ChatGPT Is Processing Your Question..." });
            askQuestion(question, async (content) => {
                console.log("Response : " + content.response);
                console.log("---------------End---------------");
                if (content.length >= MAX_RESPONSE_LENGTH) {
                    await interaction.editReply({ content: "The answer to this question is very long, so I will answer by dm." });
                    splitAndSendResponse(content.response, interaction.user);
                } else {
                    await interaction.editReply(content.response);
                }
                // TODO: send to DB
            })
        } catch (e) {
            console.error(e);
        }

        client.user.setActivity('/ask');
    }

    function askQuestion(question, cb) {
        let tmr = setTimeout((e) => {
            cb("Oppss, something went wrong! (Timeout)")
            console.error(e)
        }, 100000)

        chatGTP.sendMessage(question, {
            conversationId: res.conversationId,
            parentMessageId: res.messageId
        }).then((response) => {
            clearTimeout(tmr)
            res = response;
            cb(response)
        }).catch((err) => {
            cb("Oppss, something went wrong! (Error)")
            console.error("AskQuestion Error" + err)
        })
    }

    async function splitAndSendResponse(resp, user) {
        while (resp.length > 0) {
            let end = Math.min(MAX_RESPONSE_LENGTH, resp.length)
            await user.send(resp.slice(0, end))
            resp = resp.slice(end, resp.length)
        }
    }

    client.login(process.env.DISCORD_BOT_TOKEN).catch(console.log);
}

main() // Call Main function

// Discord Rate Limit Check
setInterval(() => {
    axios
        .get('https://discord.com/api/v10')
        .catch(error => {
            if (error.response.status == 429) 
            {
                console.log("Discord Rate Limited");
                console.warn("Status: " + error.response.status)
                console.warn(error)
                // TODO: Take Action (e.g. Change IP Address)
            }
        });

}, 100000);