const Discord = require("discord.js");

module.exports = {
	name: 'server',
	description: 'server',
	guildOnly: true,
	cooldown: 30,
	helpDisplay: true,
	type: 'Server',
	execute(message, args) {

		var embedBoi = new Discord.MessageEmbed()
		.setTitle(message.guild.name)
		.setThumbnail(message.guild.iconURL())
		.setDescription(`**Members**: ${message.guild.memberCount}
		**Creation Date**: ${message.guild.createdAt}`)
		message.channel.send(embedBoi)
    
    }
};