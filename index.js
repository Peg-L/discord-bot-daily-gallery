const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
const token = process.env.DISCORD_TOKEN;

client.on("message", async (message) => {
  if (message.channel.id !== "703832130391769091") return;
  if (message.author.bot) return;

  message.react("⭐");
});

client.on("messageReactionAdd", async (reaction, user) => {
  const message = reaction.message;
  // 只處理⭐反應，且訊息有圖片附件，且尚未被bot加過👍
  if (
    reaction.emoji.name === "⭐" &&
    message.attachments.size > 0 &&
    !message.reactions.cache.some(
      (re) => re.emoji.name === "👍" && re.users.cache.has(client.user.id)
    )
  ) {
    const channel = message.guild.channels.cache.get("1106463683426648114");
    if (channel) {
      await channel.send({
        content: `來自 <@${message.author.id}> 的精選圖片：`,
        files: [message.attachments.first().url],
      });
      await message.react("👍");
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const channel = readyClient.channels.cache.get("703832130391769091");
  if (channel) {
    channel.send("Bot 已成功上線！");
  } else {
    console.log("找不到指定的頻道");
  }
});

client.login(token);
