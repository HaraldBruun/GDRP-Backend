const mongoose = require("mongoose")

const PermissionSchema = new mongoose.Schema({
    requesterAddress: {
        type: String,
        required: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    retention: {
        type: Date,
        required: false
    },
    dataId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Permission", PermissionSchema)