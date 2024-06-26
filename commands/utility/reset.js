const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Resets the bot (dangerous!)')
    .setDMPermission(false),
  async execute(interaction) {
    if (!interaction.member.roles.cache.find(r => r.id === botInfo.adminRole)) {
      await interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});
      return;
    }

    await interaction.deferReply();

    console.log('Removing player role from all server members');
    const allMembers = await interaction.guild.members.fetch();
    const nonBotMembers = await allMembers.filter(member => !member.user.bot);
    await nonBotMembers.forEach((member) => {
      member.roles.remove(botInfo.playerRole);
      console.log(`Removed role from ${member.user.username}`);
    });

    console.log('Purging PlayerDB and resetting game state');
    playerInfo = [];
    botInfo.isGame = false;
    await interaction.editReply('The bot has been reset, any current rounds have been ended and all players have been removed from the game.');
  },
};