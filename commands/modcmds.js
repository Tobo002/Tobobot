const MCSchema = require("../schemas/modcmds-schema")

module.exports = {
	name: 'mod',
    description: 'Add mod roles and restrict certain commands to mods, as well as giving them access to certain admin commands',
    aliases: [],
    args: true,
    usage: '<"add" or "remove"> <"role" or "command"> <role or command name>',
    reqAdmin: true,
    helpDisplay: true,
    type: 'Admin',
	async execute(message, args, client) { 

        if(!["add", "remove"].includes(args[0].toLowerCase())) return message.reply(`please use the command correctly.\nSyntax: \`<"add" or "remove"> <"role" or "command"> <role or command name>\``)
        if(["role", "roles"].includes(args[1].toLowerCase())) args[1] = "role"
        else if(["command", "commands", "cmd", "cmds"].includes(args[1].toLowerCase())) args[1] = "command"
        else return message.reply(`please use the command correctly.\nSyntax: \`<"add" or "remove"> <"role" or "command"> <role or command name>\``)

        if(args[0] == `add` || args[0] == `remove` && message.mentions.roles){
            const foundSchema = await MCSchema.findOne({guildId: message.guild.id})
            if(!foundSchema){ 
                if(args[0] == `remove`) return message.reply(`there is no list of ${(args[1] = "command") ? "commands" : "roles"} to remove from.`)
                else if (args[0] == `add`){
                    var rolenames = []
                    var cmdnames = []
                    if(args[1] == 'role') {
                        message.mentions.roles.forEach(item => {
                            rolenames.push(item.name.toLowerCase())
                        })
                    }else {
                        cmdnames = args.slice(2)
                    }
                    await new MCSchema({
                        guildId: message.guild.id,
                        modroles: rolenames,
                        modcmds: cmdnames
                    }).save()
                    if(rolenames && rolenames.length > 1) message.channel.send(`The roles \`${rolenames.join(`\`, \``)}\` have been added to the list.`)
                    else if(rolenames && rolenames.length == 1) message.channel.send(`The role \`${rolenames.join(`\`, \``)}\` has been added to the the list.`)
                }
            }
            else if(foundSchema) {
                if(args[0] == `add`){
                    var rolesInDB = []
                    var addedRoles = []
                    message.mentions.roles.forEach(item => {
                        if(foundSchema.roles.includes(item.name)) rolesInDB.push(item.name)
                        else {foundSchema.roles.push(item.name); addedRoles.push(item.name);}
                    })
                    if(addedRoles && addedRoles.length > 1) message.channel.send(`The roles \`${addedRoles.join(`\`, \``)}\` have been added to the list.`)
                    else if(addedRoles && addedRoles.length == 1) message.channel.send(`The role \`${addedRoles.join(`\`, \``)}\` has been added to the the list.`)
                    if(rolesInDB && rolesInDB.length > 1) message.channel.send(`The roles \`${rolesInDB.join(`\`, \``)}\` were already in the list.`)
                    else if(rolesInDB && rolesInDB.length == 1) message.channel.send(`The role \`${rolesInDB.join(`\`, \``)}\` is already in the list.`)
                    
                }
                else if(args[0] == `remove`){
                    var rolesNotThere = []
                    var rolesRemoved = []
                    message.mentions.roles.forEach(item => {
                        if(foundSchema.roles.includes(item.name)) {foundSchema.roles.splice(foundSchema.roles.indexOf(item.name), 1); rolesRemoved.push(item.name);}
                        else rolesNotThere.push(item.name)
                    })
                    if(rolesRemoved && rolesRemoved.length > 1) message.channel.send(`The roles \`${rolesRemoved.join(`\`, \``)}\` have been removed from the list.`)
                    else if(rolesRemoved && rolesRemoved.length == 1) message.channel.send(`The role \`${rolesRemoved.join(`\`, \``)}\` has been removed from the the list.`)
                    if(rolesNotThere && rolesNotThere.length > 1) message.channel.send(`The roles \`${rolesNotThere.join(`\`, \``)}\` were not in the list.`)
                    else if(rolesNotThere && rolesNotThere.length == 1) message.channel.send(`The role \`${rolesNotThere.join(`\`, \``)}\` is not in the list.`)
                }
            }
            foundSchema.save()
        }

    }
}