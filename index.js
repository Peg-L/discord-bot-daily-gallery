const { Client, Events, GatewayIntentBits } = require("discord.js");
const http = require("http");

// 頻道 ID 設定
const SOURCE_CHANNEL_ID = "1388777841033875507"; // 來源頻道
const TARGET_CHANNEL_ID = "1412955647820959764"; // 目標頻道

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
const token = process.env.DISCORD_TOKEN;

// 為 Render 建立簡單的 HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Discord Bot is running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is running on port ${PORT}`);
});

// 移除自動加⭐功能，改為只監聽其他使用者的⭐反應

client.on("messageReactionAdd", async (reaction, user) => {
  // 忽略 bot 自己加的反應
  if (user.bot) return;

  const message = reaction.message;

  // 只處理特定頻道的⭐反應
  if (message.channel.id !== SOURCE_CHANNEL_ID) return;

  // 只處理⭐反應，且訊息有圖片附件，且尚未被bot加過👍
  if (
    reaction.emoji.name === "⭐" &&
    message.attachments.size > 0 &&
    !message.reactions.cache.some(
      (re) => re.emoji.name === "👍" && re.users.cache.has(client.user.id)
    )
  ) {
    const channel = message.guild.channels.cache.get(TARGET_CHANNEL_ID);
    if (channel) {
      await channel.send({
        content: `來自 ${message.author.username} 的精選圖片：`,
        files: [message.attachments.first().url],
      });
      await message.react("👍");
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 增加錯誤處理
client.on("error", console.error);

client.login(token);
