const ConversationService = require("../../services/chatService/conversation.service");

exports.get = async (req, res) => {
    try {
        const conversations = await ConversationService.getByUserId(
            req.user.id
        );
        return res.status(200).json(conversations);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const senderId = req.user.id;

        const messages = await ConversationService.getMessages(
            senderId,
            receiverId
        );
        if (!messages) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
