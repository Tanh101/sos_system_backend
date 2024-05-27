const Sequelize = require("sequelize");
const db = require("../../app/models/index");
const Vote = db.votes;
const Request = db.requests;
const RequestType = db.requestTypes;
const User = db.users;
const RequestMedia = db.requestMedia;

exports.isExistRequestType = async (id) => {
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

exports.create = async (userId, requests) => {
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

exports.get = async (page, itemPerPage, status, isEmergency, userId) => {
    try {
        let query = {};

        isEmergency
            ? (query = { status: status, isEmergency: isEmergency })
            : (query = { status: status });

        const requests = await Request.findAndCountAll({
            where: query,
            limit: itemPerPage,
            offset: (page - 1) * itemPerPage,
            order: [
                ["isEmergency", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: [
                        'name',
                        'avatar',
                    ],
                },
                {
                    model: RequestType,
                    as: 'requestTypes',
                    attributes: [
                        'id',
                        'name',
                        'iconUrl'
                    ],
                },
                {
                    model: RequestMedia,
                    as: 'requestMedia',
                },
                {
                    model: Vote,
                    as: 'votes',
                    attributes: [
                        'voteType',
                    ],
                    where: {
                        userId: userId
                    },
                    required: false
                }
            ],
        });

        return requests;
    } catch (error) {
        console.log(error);
    }
};

exports.getDetail = async (id, userId) => {
    try {
        const request = await Request.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: [
                        'name',
                        'avatar',
                    ],
                },
                {
                    model: RequestType,
                    as: 'requestTypes',
                    attributes: [
                        'name',
                        'iconUrl'
                    ],
                },
                {
                    model: RequestMedia,
                    as: 'requestMedia',
                },
                {
                    model: Vote,
                    as: 'votes',
                    attributes: [
                        'voteType',
                    ],
                    where: {
                        userId: userId
                    },
                    required: false
                }
            ],
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

exports.isExistRequest = async (id) => {
    try {
        const request = await Request.findOne({
            where: {
                id: id
            }
        });

        if (!request) {
            return false;
        }

        return true;
    } catch (error) {
        console.log(error)
    }
};
