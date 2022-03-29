const https = require('https')
const Discord = require('discord.js')

module.exports = {
	name: 'weather',
    description: 'Gives you current weather and a three day forcast',
    aliases: ['w'],
    args: true,
    usage: '<Region>',
    helpDisplay: true,
    type: 'Info',
	async execute(message, args, client) {

        var embed = new Discord.MessageEmbed()
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

        https.get(`https://api.weatherapi.com/v1/forecast.json?key=679e3e5be9b6487c923155046212604&q=${args.join(' ')}&days=4&aqi=no&alerts=no`, (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
            data += chunk
        })
        resp.on('end', () => {
            resp = JSON.parse(data)
            console.log(resp)
            if(resp.error) return message.reply(`that is not an accpted query.`)
            else{
                var desc = `Temperature: **${resp.current.temp_c}°C**/**${resp.current.temp_f}°F** 
                    Feels like: **${resp.current.feelslike_c}°C**/**${resp.current.feelslike_f}°F** 
                    Conditions: **${resp.current.condition.text}**
                    Max: **${resp.forecast.forecastday[0].day.maxtemp_c}°C**/**${resp.forecast.forecastday[0].day.maxtemp_f}°F**
                    Min: **${resp.forecast.forecastday[0].day.mintemp_c}°C**/**${resp.forecast.forecastday[0].day.mintemp_f}°F**`
                    
                if(parseInt(resp.forecast.forecastday[0].day.daily_chance_of_rain) > 0) desc += `\nChance of precipitation: **${resp.forecast.forecastday[0].day.daily_chance_of_rain}%**`
                else if(parseInt(resp.forecast.forecastday[0].day.daily_chance_of_snow) > 0) desc += `\nChance of precipitation: **${resp.forecast.forecastday[0].day.daily_chance_of_snow}%**`
                else desc += `\nChance of precipitation: **0%**`
                if(parseInt(resp.forecast.forecastday[0].day.daily_chance_of_rain) > 0 || parseInt(resp.forecast.forecastday[0].day.daily_chance_of_snow) > 0) desc += `\nExpected precepitation: **${resp.forecast.forecastday[0].day.totalprecip_mm}mm**/**${resp.forecast.forecastday[0].day.totalprecip_in}in**`
                resp.forecast.forecastday.shift()
                embed
                    .setTitle(resp.location.name + `'s weather (${resp.location.region}, ${resp.location.country})`)
                    .setDescription(desc)
                    .setThumbnail(`https:`+resp.current.condition.icon)
                    .setFooter(`Last updated: ${resp.current.last_updated}`)
                var date = new Date()
                var i = 1
                var day
                resp.forecast.forecastday.forEach(item => {
                    desc = `Max: **${item.day.maxtemp_c}°C**/**${item.day.maxtemp_f}°F**
                        Min: **${item.day.mintemp_c}°C**/**${item.day.mintemp_f}°F**
                        Condition: **${item.day.condition.text}**`
                    
                    if(parseInt(item.day.daily_chance_of_rain) > 0) desc += `\nChance of precipitation: **${item.day.daily_chance_of_rain}%**`
                    else if(parseInt(item.day.daily_chance_of_snow) > 0) desc += `\nChance of precipitation: **${item.day.daily_chance_of_snow}%**`
                    else desc += `\nChance of precipitation: **0%**`
                    if(parseInt(item.day.daily_chance_of_rain) > 0 || parseInt(item.day.daily_chance_of_snow) > 0) desc += `\nExpected precepitation: **${item.day.totalprecip_mm}mm**/**${item.day.totalprecip_in}in**`
                    desc += `\nDay length: **${item.astro.sunrise} - ${item.astro.sunset}**`

                    if(date.getDay()+i > 6) day = date.getDay()+i-7
                    else day = date.getDay()+i

                    embed.addField(days[day], desc, true)
                    i++
                })
                message.channel.send(embed)
            }
        }).on("error", (err) => {
            console.log("Error: " + err.message)
            })
        }).on("error", (err) => {
        console.log("Error: " + err.message)
        })
        
    }
}