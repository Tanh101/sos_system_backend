const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    message: String,
    read: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    // url: String,
});

module.exports = mongoose.model("Notification", notificationSchema);
