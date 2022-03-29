const Discord = require('discord.js');

module.exports = {
	name: 'echo',
    description: 'Make Tobobot say something in a channel of your choice',
    aliases: ['e', 'impostor', 'impersonate'],
    args: true,
    usage: '#<channel> <message>',
    reqAdmin: true,
    helpDisplay: true,
    type: 'Admin',
	execute(message, args) {

        var channelid
        var txt;
        if(message.mentions.channels.first()) {channelid = message.mentions.channels.first().id; txt = args.slice(1).join(" ")}
        else {channelid = message.channel.id; txt = args.join(" ")}
        message.channel.bulkDelete(1)

        //const messageEmbed = new Discord.MessageEmbed()
	        //.setDescription(txt)

        //message.guild.channels.cache.get(channelid).send(messageEmbed)
        message.guild.channels.cache.get(channelid).send(txt)
    }
}