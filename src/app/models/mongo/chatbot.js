const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    messages: [
        {
            sender: { type: String, required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    timestamp: { type: Date, default: Date.now },
});

const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = Chatbot;
