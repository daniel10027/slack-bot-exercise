// bot.js
// A simple Slack bot built with Bolt for JavaScript.
// Features:
//   1. Responds to messages posted in a channel it's a member of.
//   2. Recognizes a "/hello" slash command.
//   3. Logs every incoming message event (via the Events API) to the console.

require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');

// ---------------------------------------------------------------------------
// App initialization
// ---------------------------------------------------------------------------
// Bolt needs three values, all generated when you create/configure your
// Slack app (see README.md, Step 1):
//   - SLACK_BOT_TOKEN   -> OAuth token, starts with "xoxb-"
//   - SLACK_SIGNING_SECRET -> used to verify requests really come from Slack
//   - SLACK_APP_TOKEN   -> only needed if using Socket Mode, starts with "xapp-"
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // Socket Mode avoids needing a public URL during development
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.INFO,
});

// ---------------------------------------------------------------------------
// 1. Log + respond to plain messages (Events API: "message" event)
// ---------------------------------------------------------------------------
app.message(async ({ message, say }) => {
  // Ignore messages sent by bots (including this bot) to avoid loops
  if (message.subtype === 'bot_message') return;

  console.log(
    `[MESSAGE LOG] channel=${message.channel} user=${message.user} text="${message.text}"`
  );

  // Simple keyword-based response. Customize this logic as needed.
  if (message.text && message.text.toLowerCase().includes('hello')) {
    await say(`Hey <@${message.user}>! 👋 How can I help?`);
  }
});

// ---------------------------------------------------------------------------
// 2. Recognize the /hello slash command
// ---------------------------------------------------------------------------
// This requires the slash command to be created in the Slack App dashboard
// (see README.md, Step 1.5) with the command name "/hello".
app.command('/hello', async ({ command, ack, respond }) => {
  // Slack requires commands to be acknowledged within 3 seconds
  await ack();

  console.log(`[COMMAND LOG] /hello triggered by user=${command.user_id}`);

  await respond({
    response_type: 'in_channel', // visible to everyone in the channel; use 'ephemeral' for private
    text: `Hello <@${command.user_id}>! 🚀 Your bot is alive and working.`,
  });
});

// ---------------------------------------------------------------------------
// Start the app
// ---------------------------------------------------------------------------
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log('⚡️ Slack bot is running!');
})();
