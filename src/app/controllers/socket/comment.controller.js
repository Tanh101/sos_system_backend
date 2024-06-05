const CommentService = require("../../../services/commentService/comment.service");
const RequestService = require("../../../services/requestService/request.service");
const NotificationService = require("../../../services/notificationService/notification.service");

module.exports = (io, socket) => {
    socket.on("comment", async (data) => {
        try {
            const { requestId, content } = data;
            const userId = socket.user.id;

            if (!requestId) {
                return socket.emit("error", "Request ID is required");
            }

            if (!content) {
                return socket.emit("error", "Content is required");
            }

            // check if the request exists
            const request = await RequestService.getById(requestId);

            if (!request) {
                return socket.emit("error", "Invalid request ID");
            }

            const comment = await CommentService.create(
                requestId,
                userId,
                content
            );

            const commentCount = await CommentService.count(requestId);

            if (!comment) {
                return socket.emit("error", "Unable to create comment");
            }

            
            const roomName = `requestDetail_${requestId}`;
            io.to(roomName).emit("comment", {
                comment,
                commentCount,
            });
        } catch (error) {
            // ... (handle errors, e.g., invalid request ID)
        }
    });

    socket.on("deleteComment", async (data) => {
        try {
            const { commentId } = data;
            const userId = socket.user.id;

            if (!commentId) {
                return socket.emit("error", "Comment ID is required");
            }

            const comment = await CommentService.delete(commentId, userId);

            const commentCount = await CommentService.count(comment.requestId);

            if (!comment) {
                return socket.emit("error", "Unable to delete comment");
            }

            const roomName = `requestDetail_${comment.requestId}`;
            io.to(roomName).emit("deleteComment", {
                commentId,
                commentCount,
            });
        } catch (error) {
            // ... (handle errors, e.g., invalid comment ID)
        }
    });

    socket.on("joinRequestDetailRoom", async (data) => {
        const requestId = data.requestId;

        if (!requestId) {
            return socket.emit("error", "Request ID is required");
        }

        const roomName = `requestDetail_${requestId}`;

        socket.join(roomName);
        console.log(`User joined room ${roomName}`);
    });

    socket.on("leaveRequestDetailRoom", async (data) => {
        const requestId = data.requestId;

        if (!requestId) {
            return socket.emit("error", "Request ID is required");
        }

        const roomName = `requestDetail_${requestId}`;

        socket.leave(roomName);
        console.log(`User left room ${roomName}`);
    });
};
