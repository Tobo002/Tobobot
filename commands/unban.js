const https = require('https')
const Discord = require('discord.js')

module.exports = {
	name: 'Unban',
    description: 'Unban a user from the server',
    aliases: ['unbanhammerhasspoken'],
    args: true,
    usage: '<user ids to unban>',
    reqAdmin: true,
    helpDisplay: true,
    type: 'Moderation',
	async execute(message, args, client) { 

        var unbanned = []
        var notUnbanned = []

        args.forEach(async item => {
            try{
            var user = await client.users.fetch(item)
            if(!user || message.guild.member(message.guild.members.cache.get(item))) notUnbanned.push(`${item}`)
            else {message.guild.members.unban(item); unbanned.push(`${item}`)}
            }
            catch(error) {return message.reply(`there was an error executing the command.`)}
        })

        if(unbanned.length > 1) message.channel.send(`The users ${banned.join(`, `)} have been unbanned from this server.`)
        else if(unbanned.length == 1) message.channel.send(`The user ${banned.join(`, `)} has been unbanned from the this server.`)
        if(notUnbanned.length > 1) message.channel.send(`The users ${notBanned.join(`, `)} cannot be unbanned.`)
        else if(notUnbanned.length == 1) message.channel.send(`The users ${notBanned.join(`, `)} cannot be unbanned.`)

    }
}