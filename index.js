const dotenv = require("dotenv");
const { Client, IntentsBitField } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

bot.on("ready", () => {
  console.log("Bot is ready!");
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;

  let conversationLog = [
    {
      role: "system",
      content: "You are a friendly chatbot.",
    },
  ];

  conversationLog.push({
    role: "user",
    content: message.content,
  });

  await message.channel.sendTyping();

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });

  message.reply(result.data.choices[0].message);
});

bot.login(process.env.TOKEN);
