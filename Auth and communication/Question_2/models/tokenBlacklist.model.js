
const mongoose = require("mongoose")

const BlacklistTokenSchema = new mongoose.Schema({
    token : String
})

const BlacklistTokenModel = mongoose.model("BlackListtoken", BlacklistTokenSchema)

module.exports = BlacklistTokenModel;



