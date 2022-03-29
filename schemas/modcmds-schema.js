const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const Arraynoreq = {
    type: Array,
}

const MCSchema = mongoose.Schema({
    guildId: reqString,
    modroles: Arraynoreq,
    modcmds: Arraynoreq
})

module.exports = mongoose.model('mod-cmds', MCSchema)
