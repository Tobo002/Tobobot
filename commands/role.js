const roleSchema = require("../schemas/role-schema")
const Discord = require('discord.js')
const mongo = require("../mongo")

module.exports = {
	name: 'role',
    description: 'Assign yourself a role',
    aliases: ['assign'],
    args: true,
    helpDisplay: true,
    usage: '<wanted role (as long as it is self assignable)>',
    type: 'Server',
	async execute(message, args) {

        if(args[0] == `add` || args[0] == `remove` && message.member.hasPermission('ADMINISTRATOR') && message.mentions.roles){
            const foundSchema = await roleSchema.findOne({guildId: message.guild.id})
            if(!foundSchema){ 
                if(args[0] == `remove`) return message.reply(`there is no list of roles to remove from.`)
                else if (args[0] == `add`){
                    var rolenames = []
                    message.mentions.roles.forEach(item => {
                        rolenames.push(item.name.toLowerCase())
                    })
                    await new roleSchema({
                        guildId: message.guild.id,
                        roles: rolenames
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
        else{
            const foundSchema = await roleSchema.findOne({guildId: message.guild.id})
            if(foundSchema) {
                if (args[0].toLowerCase() == `list`) {
                    var list = ``
                    foundSchema.roles.forEach(item => {
                        list += `\n\`${item}\``
                    })
                    var listEmbed = new Discord.MessageEmbed()
                        .setTitle("Self Assignable Roles")
                        .setDescription(`//role <name>\n${list}`)
                        .setFooter(message.channel.guild)
                    return message.channel.send(listEmbed)
                }
                if (foundSchema.roles.includes(args[0].toLowerCase())) {
                    var roleToAssign = args[0].toLowerCase()
                    message.member.roles.add(message.guild.roles.cache.find(role => role.name == roleToAssign))
                    message.reply(`You have been given the \`${roleToAssign}\` role.`)
                }
                else message.reply(`\`${args[0]}\` is not in the list of roles to assign. Use \`//role list\` to see the list of roles you can assign yourself`)
            }
            else message.reply(`self assignable roles have not been set up on this server.`)
            foundSchema.save()
        }
	},
}