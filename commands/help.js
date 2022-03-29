const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
    description: 'List of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    helpDisplay: false,
    execute(message, args) {

        const data = []
        var cmds = [['Moderation'], ['Admin'], ['Server'], ['Info'], ['Misc']]
        const { commands } = message.client
        var embed = new Discord.MessageEmbed()
            .setTitle('Commands')
            .setDescription(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)

        if (!args.length) {

            if(!message.member.hasPermission('ADMINISTRATOR')) delete cmds.Admin
            commands.forEach(commandboi => {
                cmds.forEach(item => {
                    if(item[0] == commandboi.type && commandboi.helpDisplay) item.push(commandboi.name)
                })
            })
            cmds.forEach(item => {
                embed.addField(item.shift(), `\`${item.join(`\`, \``)}\``, false)
            })
            return message.channel.send(embed)

        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
	        return message.reply('that\'s not a command you fool.');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.type) data.push(`***Type:*** ${command.type}`)
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (message.member.hasPermission('ADMINISTRATOR') && command.adminDesc) data.push(`***Admin use:*** ${command.adminDesc}`)
        if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

        //data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });

    },
};