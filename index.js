const commands = [
  // ⚙️ Utility
  new SlashCommandBuilder().setName('ping').setDescription('Show bot latency (Owner only)'),
  new SlashCommandBuilder().setName('help').setDescription('Show all commands'),

  // 🛡️ Moderation
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true)),

  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addStringOption(o =>
      o.setName('userid').setDescription('User ID to unban').setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Time in minutes').setRequired(true)),

  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages').setRequired(true)),

  // 🔒 Channel Control
  new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock current channel'),

  new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock current channel'),

  new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode')
    .addIntegerOption(o =>
      o.setName('seconds').setDescription('Slowmode time in seconds').setRequired(true)
    ),

  // 👤 User Control
  new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change nickname')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('New nickname').setRequired(true)),

  // 🎭 Role Management
  new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add role to user')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove role from user')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    ),

].map(cmd => cmd.toJSON());
