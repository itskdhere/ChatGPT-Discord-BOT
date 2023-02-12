// Imports
import dotenv from 'dotenv'; dotenv.config();
import { ChatGPTAPIBrowser } from 'chatgpt';
import { Client, GatewayIntentBits, REST, Routes, Partials, ActivityType } from 'discord.js';
import axios from 'axios';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

// Defines
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
        description: 'Check Websocket Heartbeat && Roundtrip Latency'
    }
];

// Initialize OpenAI Session
async function initOpenAI() {
    const loginType = process.env.LOGIN_TYPE;
    const accountType = process.env.ACCOUNT_TYPE;

    if (loginType === 'openai' && accountType === 'free') {
        const api = new ChatGPTAPIBrowser({
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        });
        await api.initSession();
        return api;
    }
    else if (loginType === 'google' && accountType === 'free') {
        const api = new ChatGPTAPIBrowser({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            isGoogleLogin: true
        });
        await api.initSession();
        return api;
    }
    else if (loginType === 'openai' && accountType === 'pro') {
        const api = new ChatGPTAPIBrowser({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            isProAccount: true
        });
        await api.initSession();
        return api;
    }
    else if (loginType === 'google' && accountType === 'pro') {
        const api = new ChatGPTAPIBrowser({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            isGoogleLogin: true,
            isProAccount: true
        });
        await api.initSession();
        return api;
    }
    else {
        console.log(chalk.red('ChatGPT Error: Not a valid loginType or accountType'));
    }
}

// Initialize Discord Application Commands & New ChatGPT Thread
async function initDiscordCommands(api) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    try {
        console.log('Started refreshing application commands (/)');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands }).then(() => {
            console.log('Successfully reloaded application commands (/)');
        }).catch(e => console.log(chalk.red(e)));
        console.log('Connecting to Discord Gateway...');

    } catch (error) {
        console.log(chalk.red(error));
    }

    res = await api.sendMessage(process.env.CHATGPT_INITIAL_PROMPT); // Init New Thread
}

// Main Function (Execution Starts From Here)
async function main() {
    if (process.env.UWU === 'true') {
        console.log(gradient.pastel.multiline(figlet.textSync('ChatGPT', {
            font: 'univers',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 100,
            whitespaceBreak: true
        })));
    }

    const api = await initOpenAI().catch(error => {
        console.error(error);
        process.exit();
    });

    await initDiscordCommands(api).catch(e => { console.log(e) });

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

    client.login(process.env.DISCORD_BOT_TOKEN).catch(e => console.log(chalk.red(e)));

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
        console.log(chalk.greenBright('Connected to Discord Gateway'));
        console.log(new Date())
        client.user.setStatus('online');
        client.user.setActivity('/ask');
    });

    // Channel Message Handler
    client.on("interactionCreate", async interaction => {
        if (!interaction.isChatInputCommand()) return;

        client.user.setActivity(interaction.user.tag, { type: ActivityType.Watching });

        interaction.channel.sendTyping();

        switch (interaction.commandName) {
            case "ask":
                ask_Interaction_Handler(interaction);
                break;
            case "ping":
                ping_Interaction_Handler(interaction);
                break;
            default:
                await interaction.reply({ content: 'Command Not Found' });
        }
    });

    async function ping_Interaction_Handler(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Websocket Heartbeat: ${interaction.client.ws.ping} ms. \nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp} ms`);
        client.user.setActivity('/ask');
    }

    async function ask_Interaction_Handler(interaction) {
        const question = interaction.options.getString("question");

        console.log("----------Channel Message--------");
        console.log("Date & Time : " + new Date());
        console.log("UserId      : " + interaction.user.id);
        console.log("User        : " + interaction.user.tag);
        console.log("Question    : " + question);

        try {
            await interaction.reply({ content: `${client.user.username} Is Processing Your Question...` });
            askQuestion(question, interaction, async (content) => {
                console.log("Response    : " + content.response);
                console.log("---------------End---------------");
                if (content.length >= process.env.DISCORD_MAX_RESPONSE_LENGTH) {
                    await interaction.editReply({ content: "The answer to this question is very long, so I'll answer by DM." });
                    splitAndSendResponse(content.response, interaction.user);
                } else {
                    await interaction.editReply(`**${interaction.user.tag}:** ${question}\n**${client.user.username}:** ${content.response}\n</>`);
                }
                client.user.setActivity('/ask');
                // TODO: send to DB
            })
        } catch (e) {
            console.error(chalk.red(e));
        }
    }

    function askQuestion(question, interaction, cb) {
        let tmr = setTimeout((e) => {
            cb("Oppss, something went wrong! (Timeout)")
            console.error(chalk.red(e))
        }, 100000);

        if (process.env.TYPING_EFFECT === 'true') {
            api.sendMessage(question, {
                conversationId: res.conversationId,
                parentMessageId: res.messageId,
                onProgress: (partialResponse) => {
                    interaction.editReply(`**${interaction.user.tag}:** ${question}\n**${client.user.username}:** ${partialResponse?.response}`);
                }
            }).then((response) => {
                clearTimeout(tmr);
                res = response;
                cb(response);
            }).catch((err) => {
                cb("Oppss, something went wrong! (Error)");
                console.error(chalk.red("AskQuestion Error:" + err));
            })
        } else {
            api.sendMessage(question, {
                conversationId: res.conversationId,
                parentMessageId: res.messageId
            }).then((response) => {
                clearTimeout(tmr);
                res = response;
                cb(response);
            }).catch((err) => {
                cb("Oppss, something went wrong! (Error)")
                console.error(chalk.red("AskQuestion Error:" + err))
            })
        }
    }

    async function splitAndSendResponse(resp, user) {
        while (resp.length > 0) {
            let end = Math.min(process.env.DISCORD_MAX_RESPONSE_LENGTH, resp.length)
            await user.send(resp.slice(0, end))
            resp = resp.slice(end, resp.length)
        }
    }
}

// Discord Rate Limit Check
setInterval(() => {
    axios
        .get('https://discord.com/api/v10')
        .catch(error => {
            if (error.response.status == 429) {
                console.log("Discord Rate Limited");
                console.warn("Status: " + error.response.status)
                console.warn(error)
                // TODO: Take Action (e.g. Change IP Address)
            }
        });

}, 30000); // Check Every 30 Second

main() // Call Main function

// ---EoC---