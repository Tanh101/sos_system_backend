const mongoose = require("mongoose");

const userCountSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        unviewedNotifications: { type: Number, default: 0 },
        unviewedMessages: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("user_counts", userCountSchema);
