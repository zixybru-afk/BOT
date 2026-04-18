require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// 📜 Commands
const commands = [
  // ⚙️ Utility
  new SlashCommandBuilder().setName('ping').setDescription('Show bot latency (Owner only)'),
  new SlashCommandBuilder().setName('help').setDescription('Show all commands'),

  // 🛡️ Moderation
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true)),

  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Amount').setRequired(true)),

  // 🔒 Channel
  new SlashCommandBuilder().setName('lock').setDescription('Lock channel'),
  new SlashCommandBuilder().setName('unlock').setDescription('Unlock channel'),

  new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode')
    .addIntegerOption(o => o.setName('seconds').setDescription('Seconds').setRequired(true)),

  // 👤 Nick
  new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change nickname')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('Name').setRequired(true)),

  // 🎭 Roles
  new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add role')
        .addUserOption(o => o.setName('user').setRequired(true))
        .addRoleOption(o => o.setName('role').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove role')
        .addUserOption(o => o.setName('user').setRequired(true))
        .addRoleOption(o => o.setName('role').setRequired(true))
    ),

].map(cmd => cmd.toJSON());

// 🚀 Register Commands
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log('Commands loaded ✅');
});

// ⚙️ Command Handler (empty for now)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    interaction.reply('Pong 🚀');
  }

  if (interaction.commandName === 'help') {
    interaction.reply('Commands loaded. Use / to see all.');
  }
});

client.login(process.env.TOKEN);
