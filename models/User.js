const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountAddress: {
        type: String
    },
    citizenContract: {
        type: String
    }

});

module.exports = mongoose.model("Users", UserSchema);
