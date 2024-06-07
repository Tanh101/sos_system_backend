const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        message: String,
        read: { type: Boolean, default: false },
        requestId: { type: Number, required: false },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);
