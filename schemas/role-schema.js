const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const Arraynoreq = {
    type: Array,
}

const roleSchema = mongoose.Schema({
    guildId: reqString,
    roles: Arraynoreq
})

module.exports = mongoose.model('assignable-roles', roleSchema)