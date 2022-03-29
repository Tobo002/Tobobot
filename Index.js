const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, commandSent } = require("./config.json");
const mongo = require("./mongo");
const { reqAdmin } = require('./commands/echo');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//cooldowns
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', async() => {
    console.log('Ready!');

    client.user.setPresence({ activity: {name: `for ${prefix}help`, type: 'WATCHING'}, status: "Online"});
    
    await mongo().then((mongoose) => {
            console.log('Connected to mongo!');
    })
});

client.on('message', async message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

    //divides message into args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    //check commands folder for the command
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

    //guildonly machine
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.reqAdmin && !message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply('you need admin for this command.')
    }

    if(command.devOnly && message.author.id !== '620345199087845388') {
        return message.reply('only the developper has access to this command.')
    }


    //if there's no args
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        //what the correct use of the command is
		if (command.usage) {
			reply += `\nTry using: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
    }

    //cooldown machine
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {

        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {

		    const timeLeft = (expirationTime - now) / 1000;
		    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
       
        }
    }

timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //try to execute command
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});

client.login(token);