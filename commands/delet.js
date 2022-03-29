module.exports = {
	name: 'delet',
    description: 'Delete a specific amount of messages in the channel',
    aliases: ['nuke', 'chop', 'purge', 'd'],
    args: true,
    usage: '<number of messages to delete>',
    helpDisplay: true,
    reqAdmin: true,
    type: 'Moderation',
	execute(message, args) {

        hundreds = Math.floor(parseInt(args[0])/100)

        for(i = 1; i <= hundreds; i++) {
            message.channel.bulkDelete(100)
        }
        remaining = parseInt(args[0])-hundreds*100
        message.channel.bulkDelete(remaining)

        if (args.includes(`from`)){
            fromdelete()
        }

        function fromdelete() {

            var users = message.mentions.users
            const amount = parseInt(args[0])

            if (!amount) return message.reply(`please specify an amount of messages to delete.`)
            if (!users) return message.reply(`please mention a user you wan to delete messages from`)

            users = users.forEach(item => {item = item.id})

            hundreds = Math.floor(amount/100)

            for(i = 1; i <= hundreds; i++){
                message,channel.messages.fetch({
                    limit:100
                }).then(messages => {
                    messages = messages.filter(m => users.has(m.author.id))
                })
            }

        }
        
    }
}