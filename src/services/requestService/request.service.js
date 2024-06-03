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

exports.createNormalRequest = async (userId, isEmergency, requestTypeId, content,
    latitude, longitude, address) => {
    try {
        const newRequest = await Request.create({
            userId,
            requestTypeId,
            content,
            latitude,
            longitude,
            address,
            isEmergency,
        });

        return newRequest;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.createEmergencyRequest = async (userId, isEmergency, latitude, longitude, address) => {
    try {
        const newRequest = await Request.create({
            isEmergency: isEmergency,
            userId: userId,
            latitude: latitude,
            longitude: longitude,
            address: address
        })

        return newRequest;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

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
                        'id',
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

exports.getUserRequestByStatus = async (userId, isEmergency, status, itemPerPage, page) => {
    try {
        let query = {};

        isEmergency
            ? (query = { userId: userId, status: status, isEmergency: isEmergency })
            : (query = { userId: userId, status: status });

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
        console.log(error)
        throw error;
    }
};


exports.isExistRequest = async (requestId) => {
    try {
        const request = Request.findByPk(requestId);
        if (request) {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}