const Comment = require("../../app/models/mongo/comment");
const db = require("../../app/models/index");
const User = db.users;

exports.create = async (requestId, userId, content) => {
    try {
        const comment = await Comment.create({
            requestId,
            userId,
            content,
        });

        const user = await User.scope("withoutPhone").findByPk(userId);

        return {
            _id: comment._id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            user,
        };
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};

exports.get = async (requestId) => {
    try {
        const comments = await Comment.find({ requestId }).sort({ createdAt: -1 });

        const userIds = comments.map((comment) => comment.userId);
        const users = await User.scope("withoutPhone").findAll({
            where: { id: [...new Set(userIds)] },
        });

        const userMap = {};
        users.forEach((user) => {
            userMap[user.id] = user;
        });

        const formattedComments = comments.map((comment) => {
            return {
                _id: comment._id,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                user: userMap[comment.userId],
            };
        });

        return formattedComments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

exports.delete = async (commentId) => {
    try {
        const comment = await Comment.findByIdAndDelete(commentId);

        return comment;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

exports.update = async (commentId, content) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );

        return comment;
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
};

exports.count = async (requestId) => {
    try {
        const count = await Comment.countDocuments({ requestId });

        return count;
    } catch (error) {
        console.error("Error counting comments:", error);
        throw error;
    }
};

exports.isOwner = async (commentId, userId) => {
    try {
        const comment = await Comment
            .findById(commentId)
            .select("userId");
        
        return comment.userId === userId;
    } catch (error) {
        console.error("Error checking comment:", error);
        throw error;
    }    
}
