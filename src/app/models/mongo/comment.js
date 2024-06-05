const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    requestId: { type: Number, required: true },
    userId: { type: Number, required: true },
    content: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
