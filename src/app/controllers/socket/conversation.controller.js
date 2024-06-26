const ConversationService = require("../../../services/chatService/conversation.service");
const UserCountService = require("../../../services/userCountService/userCount.service");

module.exports = (io, socket) => {
    socket.on("privateMessage", async (data) => {
        const { receiver, message } = data;
        const sender = socket.user.id;

        console.log("privateMessage", message);

        try {
            const conversation = await ConversationService.update(
                sender,
                receiver,
                message
            );

            if (!conversation) {
                return socket.emit("error", "Unable to send message");
            }

            const newMessage = conversation.lastMessage;
            const receiverRoom = `user_${receiver}`;
            const senderRoom = `user_${sender}`;

            // Emit the message to the sender and receiver
            io.to(receiverRoom).emit("privateMessage", {
                conversationId: conversation._id,
                message: newMessage,
            });
            io.to(senderRoom).emit("privateMessage", {
                conversationId: conversation._id,
                message: newMessage,
            });

            // Notify the receiver
            io.to(receiverRoom).emit("newMessage", {
                conversationId: conversation._id,
                message: newMessage,
            });

        } catch (error) {
            // ... (handle errors, e.g., invalid user ID)
        }
    });

    socket.on("markAsRead", async (data) => {
        const { conversationId } = data;
        const userId = socket.user.id;

        try {
            const conversation = await ConversationService.markAsRead(
                conversationId,
                userId
            );

            if (!conversation) {
                return socket.emit("error", "Unable to mark as read");
            }

            io.to(userId).emit("markAsRead", { conversationId });
        } catch (error) {
            // ... (handle errors, e.g., invalid conversation ID)
        }
    });
};
