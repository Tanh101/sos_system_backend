const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: Number, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
    participants: [{ type: Number, required: true }], // Array of user IDs
    messages: [messageSchema],
    lastMessage: messageSchema, // Store the latest message
    unreadCount: { type: Map, of: Number, default: {} }, // Track unread messages for each user
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
