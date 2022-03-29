module.exports = {
	name: 'test',
    description: 'test',
    aliases: ['t'],
    args: false,
    usage: 'etstestosyerhjigr',
    reqAdmin: true,
    helpDisplay: false,
    devOnly: true,
	execute(message, args) {

        message.channel.send(args.slice(2))

    }
}