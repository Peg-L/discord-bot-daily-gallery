const { Client, Events, GatewayIntentBits } = require("discord.js");
const http = require("http");

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

client.on("message", async (message) => {
  if (message.channel.id !== "1388777841033875507") return;
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
    const channel = message.guild.channels.cache.get("1412955647820959764");
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

client.login(token);
