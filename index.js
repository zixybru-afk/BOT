require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const OWNER_ID = "1351973906336059454";

// 📜 COMMANDS
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Advanced ping (owner only)'),
  new SlashCommandBuilder().setName('help').setDescription('Show commands'),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban user')
    .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true)),

  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Amount').setRequired(true)),

  new SlashCommandBuilder().setName('lock').setDescription('Lock channel'),
  new SlashCommandBuilder().setName('unlock').setDescription('Unlock channel'),

  new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode')
    .addIntegerOption(o => o.setName('seconds').setDescription('Seconds').setRequired(true)),

  new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change nickname')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('Name').setRequired(true)),

  new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add role')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove role')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    ),

].map(cmd => cmd.toJSON());

// 🚀 REGISTER COMMANDS
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log('Commands loaded ✅');
});

// ⚙️ COMMAND HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // 🔥 PING (ADVANCED)
  if (commandName === 'ping') {
    if (interaction.user.id !== OWNER_ID)
      return interaction.reply({ content: 'Owner only ❌', ephemeral: true });

    const sent = Date.now();
    await interaction.reply({ content: 'Pinging...', fetchReply: true });

    const latency = Date.now() - sent;
    const api = Math.round(client.ws.ping);

    return interaction.editReply(
      `🏓 Latency: ${latency}ms\n📡 API: ${api}ms`
    );
  }

  // 📜 HELP
  if (commandName === 'help') {
    return interaction.reply({
      content: `
🛡️ Moderation:
/kick /ban /unban /timeout /clear

🔒 Channel:
/lock /unlock /slowmode

👤 User:
/nick

🎭 Role:
/role add /role remove
      `,
      ephemeral: true
    });
  }

  // 🔨 KICK
  if (commandName === 'kick') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return interaction.reply({ content: 'No permission ❌', ephemeral: true });

    const user = interaction.options.getMember('user');
    await user.kick();
    return interaction.reply(`Kicked ${user.user.tag}`);
  }

  // 🔨 BAN
  if (commandName === 'ban') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ content: 'No permission ❌', ephemeral: true });

    const user = interaction.options.getMember('user');
    await user.ban();
    return interaction.reply(`Banned ${user.user.tag}`);
  }

  // 🔓 UNBAN
  if (commandName === 'unban') {
    const id = interaction.options.getString('userid');
    await interaction.guild.members.unban(id);
    return interaction.reply(`Unbanned ${id}`);
  }

  // ⏳ TIMEOUT
  if (commandName === 'timeout') {
    const user = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');

    await user.timeout(minutes * 60000);
    return interaction.reply(`Timed out ${user.user.tag}`);
  }

  // 🧹 CLEAR
  if (commandName === 'clear') {
    const amount = interaction.options.getInteger('amount');
    await interaction.channel.bulkDelete(amount, true);
    return interaction.reply({ content: `Deleted ${amount}`, ephemeral: true });
  }

  // 🔒 LOCK
  if (commandName === 'lock') {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
      SendMessages: false
    });
    return interaction.reply('Channel locked 🔒');
  }

  // 🔓 UNLOCK
  if (commandName === 'unlock') {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
      SendMessages: true
    });
    return interaction.reply('Channel unlocked 🔓');
  }

  // 🐢 SLOWMODE
  if (commandName === 'slowmode') {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);
    return interaction.reply(`Slowmode set to ${seconds}s`);
  }

  // 👤 NICK
  if (commandName === 'nick') {
    const user = interaction.options.getMember('user');
    const name = interaction.options.getString('name');

    await user.setNickname(name);
    return interaction.reply(`Nickname changed`);
  }

  // 🎭 ROLE
  if (commandName === 'role') {
    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (sub === 'add') {
      await user.roles.add(role);
      return interaction.reply(`Role added`);
    }

    if (sub === 'remove') {
      await user.roles.remove(role);
      return interaction.reply(`Role removed`);
    }
  }
});

client.login(process.env.TOKEN);
