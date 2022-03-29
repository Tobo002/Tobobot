const { DiscordAPIError } = require('discord.js');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('86aeeaea76a445bf98f4bb43ee5db081');
const Discord = require('discord.js');

module.exports = {
	name: 'news',
    description: 'You can search for news by category or keyword.\n Categories: (business, entertainment, general, music, science-and-nature, sport, technology)',
    aliases: ['n',],
    usage: '<category or keyword> <page (if empty will show page 1)> <item (optional)>',
    args: true,
    helpDisplay: true,
    type: 'Info',
	execute(message, args) {
        
        var search = args[0].toLowerCase()
        var searchType = 'Keyword'

        if(['business', 'entertainment', 'general', 'music', 'science-and-nature', 'sport', 'technology',].includes(search)) {
            var chosenCat = search
            searchType = 'Category'
        }else var keyword = search
        
        newsapi.v2.topHeadlines({
            q: keyword,
            category: chosenCat,
            language: 'en',
            country: 'us'
        }).then(response => {
            var amountOfPages = Math.ceil(response.totalResults/5)
            var currentPage = parseInt(args[1])
            var selectedItem = parseInt(args[2])
            var displayArticle = new Discord.MessageEmbed()

            if (!currentPage) currentPage = 1

            var bounds = 5
            if(currentPage && Math.ceil(response.articles.length/5) >= currentPage > 0) bounds = Math.floor(currentPage*5)
            var pageItems = response.articles.slice(bounds-5, bounds)

            if (selectedItem) {

                var itemToView = pageItems[selectedItem-1]

                displayArticle
                    .setTitle(itemToView.title)
                    .setURL(itemToView.url)
                    .setDescription(itemToView.description)
                    .setAuthor(`${itemToView.author} · ${itemToView.source.name}`)
                    .setImage(itemToView.urlToImage)

            }else {

                    displayArticle
                        .setTitle(`Results: **${response.totalResults}**`)
                        .setDescription(`Searched by: **${searchType}**`)
                        .setFooter(`Page ${currentPage} of ${amountOfPages}`)

                pageItems.forEach(item => {
                    displayArticle
                        .addField(item.title, item.description, false)
                })

            }

            message.channel.send(displayArticle)

          })

	},
};