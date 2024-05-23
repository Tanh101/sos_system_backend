const Sequelize = require("sequelize");
const db = require("../../app/models/index");
const Request = db.requests;
const RequestType = db.requestTypes;

exports.isExistRequestType = async(id) => {
    const requestType = await RequestType.findOne({
        where: {
            id: id,
        },
    });
    if (!requestType) {
        return false;
    }

    return true;
};

exports.create = async(userId, requests) => {
    try {
        const newRequest = Request.create({
            userId: userId,
            requestTypeId: requests.requestTypeId,
            isEmergency: requests.isEmergency,
            content: requests.content,
            latitude: requests.latitude,
            longitude: requests.longitude,
            address: requests.address,
        });

        return newRequest;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.get = async(page, itemPerPage, status, isEmergency) => {
    try {
        let query = {};

        isEmergency
            ? (query = { status: status, isEmergency: isEmergency })
            : (query = { status: status });

        const requests = await Request.findAndCountAll({
            where: query,
            limit: Sequelize.literal(itemPerPage),
            offset: Sequelize.literal((page - 1) * itemPerPage),
            order: [
                ["isEmergency", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: ["users", "requestTypes", "requestMedia"],
        });

        return requests;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getDetail = async(id) => {
    try {
        const request = await Request.findOne({
            where: {
                id: id,
            },
            include: ["users", "requestTypes", "requestMedia"],
        });

        if (!request) {
            return false;
        }

        return request;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getById = async (id) => {
    try {
        const request = await Request.findOne({
            where: {
                id: id,
            },
            include: ["users", "requestTypes", "requestMedia"],
        });

        if (!request) {
            return false;
        }

        return request;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.upvote = async(id, userId) => {
    try {
        const request = await Request.findOne({
            where: {
                userId: userId,
                id: id,
            },
        });

        if (!request) {
            return false;
        }

        request.voteCount += 1;
        request.save();

        return request.voteCount;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.downvote = async(id, userId) => {
    try {
        const request = await Request.findOne({
            where: {
                userId: userId,
                id: id,
            },
        });

        if (!request) {
            return false;
        }

        request.voteCount -= 1;
        request.save();

        return request.voteCount;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
