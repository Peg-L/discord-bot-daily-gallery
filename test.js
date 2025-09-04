// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const channel = readyClient.channels.cache.get("703832130391769091");
  if (channel) {
    channel.send("Bot 已成功上線！");
  } else {
    console.log("找不到指定的頻道");
  }
});

// Log in to Discord with your client's token
client.login(token);
