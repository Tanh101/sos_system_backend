const mongoose = require("mongoose");
const { KEY_TYPE } = require("../../../constants/constants");

const keySchema = new mongoose.Schema({
    value: { type: String, required: true },
    type: {
        type: String,
        unique: true,
        default: KEY_TYPE.GGMAP,
    }
});

const Key = mongoose.model("keys", keySchema);

module.exports = Key;
