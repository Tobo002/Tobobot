const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const pollSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString
})

module.exports = mongoose.model('poll-channels', pollSchema)