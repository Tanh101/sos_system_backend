const CommentService = require('../../services/commentService/comment.service');
const RequestService = require('../../services/requestService/request.service');

exports.get = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await CommentService.get(id);

        return res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.create = async (req, res) => {
    try {
        const { requestId, content } = req.body;
        const userId = req.user.id;

        // check if the request exists
        const request = await RequestService.getById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const comment = await CommentService.create(requestId, userId, content);

        return res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.update = async (req, res) => {
    try {
        const { id, content } = req.body;
        const comment = await CommentService.update(id, content);

        return res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await CommentService.delete(id);

        return res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.count = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const count = await CommentService.count(requestId);

        return res.status(200).json({ count });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


