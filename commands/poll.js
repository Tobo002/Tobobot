const { DiscordAPIError, Guild, TeamMember } = require("discord.js")
const mongo = require("../mongo")
const pollSchema = require("../schemas/poll-schema")

module.exports = {
	name: 'poll',
    description: 'send a poll that people can vote on in the poll channel',
    aliases: ['p', 'ask'],
    args: true,
    usage: '<poll question> or <"set"> to set channel for polls to be sent to (Admin only)',
    helpDisplay: true,
    type: 'Server',
	async execute (message, args,) {

        //#region set poll channel

        if(args.length == 1 && args[0] == `set` && message.member.hasPermission('ADMINISTRATORR')) {
            const foundSchema = await pollSchema.findOne({guildId: message.guild.id})
            if(!foundSchema){
                    await new pollSchema({
                        guildId: message.guild.id,
                        channelId: message.channel.id
                    }).save()
            }else {
                    foundSchema.channelId = message.channel.id
                    foundSchema.save()
            }
            return message.channel.send(`All polls will now be sent to this channel (\`${message.channel.name}\`)`)
        }

        //#endregion

        //#region variables

        var pollChannel = {}

        try{
            const foundSchema = await pollSchema.findOne({guildId: message.guild.id})
            pollChannel = message.guild.channels.cache.get(foundSchema.channelId)
        }
        catch(error) {
            console.error(error)
            message.reply(`There was an error fetching your channel poll channel ID. 
            If you haven't already, use \`poll set\` in the channel you want your polls to be sent to.`)
        }

        var quantAnswers
        var answers = []
        var answerList = ""
        const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

        //#endregion
        
        //#region type select and yes/no poll

        try{
            message.channel.send('Is your question yes or no or multiple choice?\nReact with :blue_circle: for yes or no or :red_circle: for multiple choice.').then(sentMessage => {
                sentMessage.react('🔵').then(() => sentMessage.react('🔴'))

                const filter = (reaction, user) => {
                    return['🔵','🔴'].includes(reaction.emoji.name) && user.id === message.author.id
                }

                sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '🔵') {
                            message.channel.send('Your question has been sent!')
                            pollChannel.send(`${message.author}'s question: **${args.join(" ")}**`).then(sentMessage02 => {
                                sentMessage02.react('✅').then(() => sentMessage02.react('❎'))
                            })
                        } else {
                            getMultipleAnswers()
                        }
                    })
            })
        }catch(error){
            message.channel.send(`there was an error.`)
            console.log(error)
        }

        //#endregion

        //#region multiple answer poll

        //#region asking answer options

        function getMultipleAnswers() {

            const filter02 = m => m.author.id === message.author.id
            message.channel.send("How many answers will your question have? Please input a number smaller than 9 in the next thirty seconds.")
            message.channel.awaitMessages(filter02, {max: 1, time: 30000}).then(async collected02 => {

                quantAnswers = parseInt(collected02.first())

                if(!quantAnswers){
                    message.reply(`That's not a valid input, input a number next time.`)
                    return getMultipleAnswers()
                }

                if(quantAnswers > 9) {
                    message.reply(`Please enter a value of nine or less.`)
                    return getMultipleAnswers()
                }

                var i = 1

                while (i <= quantAnswers) {

                    message.channel.send(`Answer ${i} >`)
                    
                    try{
                        answers[i] = await message.channel.awaitMessages(filter02, {max: 1, time: 30000})
                    }catch (error){
                        console.log(error)
                    }

                    i ++

                }

                if (i = quantAnswers + 1) {

                   confirmMultiple()

                }

            })

        }

        //#endregion 

        //#region confirm choices

        function confirmMultiple() {

            var i = 0

            answers.forEach(item => {
                answerList += `\n${numberEmojis[i]}: ${answers[i+1].first().content}`
                i ++
            })

            message.channel.send(`Your answer choices are:${answerList}`)

            message.channel.send(`Are you sure you want to send the poll?`).then(sentMessage03 => {
                sentMessage03.react('✅').then(() => sentMessage03.react('❎'))

                const filter = (reaction, user) => {
                    return['✅','❎'].includes(reaction.emoji.name) && user.id === message.author.id
                }

                sentMessage03.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected03 => {
                        
                        const reaction = collected03.first()

                        if (reaction.emoji.name === '✅') {

                            message.channel.send(`Sending your poll now.`)

                            sendMultiple()
                            
                        } else {

                            message.channel.send(`Oof, all that effort for nothing? Better luck next time!`)

                        }

                    })

            })

        }

        //#endregion

        //#region send

        function sendMultiple() {

            pollChannel.send(`${message.author}'s question: **${args.join(' ')}**\n${answerList}`).then(sentMessage04 => {
                
                i = 0

                while (i <= quantAnswers-1) {

                    sentMessage04.react(numberEmojis[i])
                    i ++

                }
            })
        }

        //#endregion

        //#endregion

    },
}