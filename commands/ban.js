const https = require('https')
const Discord = require('discord.js')

module.exports = {
	name: 'ban',
    description: 'Ban a user from the server',
    aliases: ['banhammerhasspoken'],
    args: true,
    usage: '<users to ban (ids or @ mentions)>',
    reqAdmin: true,
    helpDisplay: true,
    type: 'Moderation',
	async execute(message, args, client) { 

        var ids = message.mentions.members || args
        var banned = []
        var notBanned = []
        var notMember = []

        ids.forEach(item => {
            try{
            var memberthing = message.guild.members.cache.get(item.id ? item.id : item)
            if(message.guild.member(memberthing)){
                if(memberthing.roles.highest.position >= message.member.roles.highest.position) notBanned.push(`${item}`)
                else {message.guild.members.ban(item); banned.push(`${item}`)}
            } else notMember.push(`${item}`)
            }
            catch(error) {return message.reply(`there was an error executing the command.`)}
        })

        if(banned.length > 1) message.channel.send(`The users ${banned.join(`, `)} have been banned from this server.`)
        else if(banned.length == 1) message.channel.send(`The user ${banned.join(`, `)} has been banned from the this server.`)
        if(notBanned.length > 1) message.channel.send(`The users ${notBanned.join(`, `)} cannot be banned since your highest role is not higher than theirs.`)
        else if(notBanned.length == 1) message.channel.send(`The user ${notBanned.join(`, `)} cannot be banned since your highest role is not higher than theirs.`)
        if(notMember.length > 1) message.channel.send(`The users ${notMember.join(`, `)} are not in this server.`)
        else if(notMember.length == 1) message.channel.send(`The user ${notMember.join(`, `)} is not in this server.`)

    }
}
