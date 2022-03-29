module.exports = {
	name: 'eval',
    description: 'evaluates',
    aliases: ['boop', '🅱️'],
    args: true,
    usage: '#<channel> <message>',
    helpDisplay: false,
    devOnly: true,
	async execute(message, args, client) {

        eval(args.join(' '))
        message.channel.send(`✅you just got eval'd`)
        
    }
}