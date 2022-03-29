module.exports = {
	name: 'verify',
    description: 'Why would you do this? Why would you look this up in help? Do something with your life. Btw, take this egg :egg:',
    helpDisplay: false,
	execute(message, args) {

        message.member.roles.add(message.guild.roles.cache.find(role => role.name == 'boi'))
    
    }
};