// Imports
import dotenv from 'dotenv'; dotenv.config();
import { ChatGPTAPI } from 'chatgpt';
import axios from 'axios';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import admin from 'firebase-admin';
import {
  Client, MessageMentions, REST,
  GatewayIntentBits, ChannelType,
  Routes, Partials, ActivityType
}
  from 'discord.js';

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
  },
  {
    name: 'reset-chat',
    description: 'Start A fresh Chat Session'
  }
];

// Initialize OpenAI Session
async function initOpenAI() {
  if (process.env.API_ENDPOINT.toLocaleLowerCase() === 'default') {
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY
    });
    return api;
  } else {
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      apiBaseUrl: process.env.API_ENDPOINT.toLocaleLowerCase()
    });
    return api;
  }
}

// Initialize Discord Application Commands & New ChatGPT Thread
async function initDiscordCommands() {
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
}

async function initFirebaseAdmin() {
  admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_ADMIN_SDK_PATH),
    databaseURL: process.env.FIRESTORE_DATABASE_URL
  });

  const db = admin.firestore();

  return db;
}

// Main Function (Execution Starts From Here)
async function main() {
  if (process.env.UWU === 'true') {
    console.log(gradient.pastel.multiline(figlet.textSync('ChatGPT', {
      font: 'Univers',
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

  await initDiscordCommands().catch(e => { console.log(e) });

  const db = await initFirebaseAdmin();

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

    switch (interaction.commandName) {
      case "ask":
        ask_Interaction_Handler(interaction);
        break;
      case "ping":
        ping_Interaction_Handler(interaction);
        break;
      case 'reset-chat':
        reset_chat_Interaction_Handler(interaction);
        break;
      default:
        await interaction.reply({ content: 'Command Not Found' });
    }
  });

  client.on("messageCreate", async message => {
    if (process.env.DIRECT_MESSAGES !== "true" || message.channel.type != ChannelType.DM || message.author.bot) {
      return;
    }

    if (!process.env.DM_WHITELIST_ID.includes(message.author.id)) {
      await message.author.send("Ask Bot Owner To WhiteList Your ID 🙄");
      return;
    }

    console.log("----------Direct Message---------");
    console.log("Date & Time : " + new Date());
    console.log("UserId      : " + message.author.id);
    console.log("User        : " + message.author.tag);
    console.log("Question    : " + message.content);

    try {
      let sentMessage = await message.author.send("Let Me Think 🤔")
      let interaction = {
        "user": {
          "id": message.author.id,
          'tag': message.author.tag
        }
      }
      askQuestion(message.content, interaction, async (response) => {
        if (response.text.length >= process.env.DISCORD_MAX_RESPONSE_LENGTH) {
          splitAndSendResponse(response.text, message.author)
        } else {
          await sentMessage.edit(response.text)
        }
        console.log("Response    : " + response.text);
        console.log("---------------End---------------");
      })
    } catch (e) {
      console.error(e)
    }
  })

  async function ping_Interaction_Handler(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...🌐', fetchReply: true });
    await interaction.editReply(`Websocket Heartbeat: ${interaction.client.ws.ping} ms. \nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp} ms`);
    client.user.setActivity('/ask');
  }

  async function reset_chat_Interaction_Handler(interaction) {
    await interaction.reply('Checking...💨');
    const doc = await db.collection('users').doc(interaction.user.id).get();
    if (!doc.exists) {
      console.log('Chat Reset: Failed ❌');
      await interaction.editReply('Chat Reset: Failed ❌');
    } else {
      // await db.collection('users').doc(interaction.user.id).update({
      //   conversationId: FieldValue.delete(),
      //   parentMessageId: FieldValue.delete()
      // });
      await db.collection('users').doc(interaction.user.id).delete();
      console.log('Chat Reset: Successful ✅');
      await interaction.editReply('Chat Reset: Successful ✅');
    }
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
      await interaction.reply({ content: `${client.user.username} Is Processing Your Question... ` });
      askQuestion(question, interaction, async (content) => {
        console.log("Response    : " + content.text);
        console.log("---------------End---------------");
        if (content.text.length >= process.env.DISCORD_MAX_RESPONSE_LENGTH) {
          await interaction.editReply({ content: "The answer to this question is very long, so I'll answer by DM." });
          splitAndSendResponse(content.text, interaction.user);
        } else {
          await interaction.editReply(`**${interaction.user.tag}:** ${question}\n**${client.user.username}:** ${content.text}\n</>`);
        }
        client.user.setActivity('/ask');
        const timeStamp = new Date();
        const date = timeStamp.getDate().toString();
        const time = timeStamp.getTime().toString();
        await db.collection('chat-history').doc(interaction.user.id)
          .collection(date).doc(time).set({
            timeStamp: new Date(),
            userID: interaction.user.id,
            user: interaction.user.tag,
            question: question,
            answer: content.text,
            conversationId: content.id,
            parentMessageId: content.parentMessageId
          });

      })
    } catch (e) {
      console.error(chalk.red(e));
    }
  }

  async function askQuestion(question, interaction, cb) {
    const docRef = db.collection('users').doc(interaction.user.id);
    const doc = await docRef.get()
    if (!doc.exists) {
      api.sendMessage(question).then((response) => {
        db.collection('users').doc(interaction.user.id).set({
          userId: interaction.user.id,
          user: interaction.user.tag,
          conversationId: response.id,
          parentMessageId: response.parentMessageId
        });
        cb(response);
      }).catch((err) => {
        cb("Oppss, something went wrong! (Error)");
        console.error(chalk.red("AskQuestion Error:" + err));
      })

    } else {
      const conversationId = doc.data().conversationId;
      const parentMessageId = doc.data().parentMessageId
      console.log(conversationId)
      console.log(parentMessageId)
      api.sendMessage(question, {
        conversationId: conversationId,
        parentMessageId: parentMessageId
      }).then((response) => {
        console.log(response.id)
        console.log(response.parentMessageId)
        db.collection('users').doc(interaction.user.id).set({
          userId: interaction.user.id,
          user: interaction.user.tag,
          conversationId: response.id,
          parentMessageId: response.parentMessageId
        });
        cb(response);
      }).catch((err) => {
        cb("Oppss, something went wrong! (Error)");
        console.error(chalk.red("AskQuestion Error:" + err));
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