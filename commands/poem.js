const https = require('https')
const Discord = require('discord.js')

module.exports = {
	name: 'poem',
    description: 'Gives a random 14 line poem',
    aliases: ['wow'],
    args: false,
    helpDisplay: true,
    type: 'Misc',
	async execute(message, args, client) {

        var embed = new Discord.MessageEmbed()

        https.get(`https://poetrydb.org/random,linecount/1;14`, (resp) => {
            let data = ''
            resp.on('data', (chunk) => {
                data += chunk
            })
            resp.on('end', () => {
                resp = JSON.parse(data)
                console.log(resp)

                embed
                    .setTitle(resp[0].title)
                    .setAuthor(resp[0].author)
                    .setDescription(resp[0].lines.join(`\n`))

                message.channel.send(embed)
                
            }).on("error", (err) => {
            console.log("Error: " + err.message)
            })
        })
        
    }
}