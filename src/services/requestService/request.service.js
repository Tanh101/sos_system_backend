const Sequelize = require("sequelize");
const db = require("../../app/models/index");
const { REQUEST_STATUS } = require("../../constants/constants");
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

        if (status) {
            query = { status: status };
        }
        if (isEmergency) {
            query = { isEmergency: isEmergency };
        }

        if (status && isEmergency) {
            query = { status: status, isEmergency: isEmergency };
        }

        const requests = await Request.findAndCountAll({
            where: query,
            limit: itemPerPage,
            offset: (page - 1) * itemPerPage,
            order: [
                ["isEmergency", "DESC"],
                ["status", "ASC"],
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
                        'id',
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

exports.getUserRequestByStatus = async (userId, isEmergency, status, page, itemPerPage) => {
    try {
        let query = { userId: userId };

        if (isEmergency !== undefined) {
            query.isEmergency = isEmergency;
        }

        if (status !== undefined && status !== null) {
            query.status = status;
        }

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
        console.log(error)
        throw error;
    }
};

exports.isExistRequest = async (requestId) => {
    try {
        const request = await Request.findByPk(requestId);
        if (request) {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.updateRequestStatus = async (requestId, status) => {
    try {
        const request = await Request.update(
            {
                status: status,
            },
            {
                where: {
                    id: requestId,
                },
            }
        );

        return request;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.finishRequest = async (requestId) => {
    try {
        const request = await Request.update(
            {
                status: REQUEST_STATUS.RESCUED,
            },
            {
                where: {
                    id: requestId,
                },
            }
        );

        return request;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

exports.reopenRequest = async (requestId) => {
    try {
        const request = await Request.update(
            {
                status: REQUEST_STATUS.PENDING,
                rescuerId: null,
            },
            {
                where: {
                    id: requestId,
                },
            }
        );

        //emit event to notify user

        return request;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.acceptRequest = async (rescuerId, requestId) => {
    try {
        const request = await Request.update(
            {
                status: REQUEST_STATUS.RESCUING,
                rescuerId: rescuerId,
            },
            {
                where: {
                    id: requestId,
                },
            }
        );
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.getEmergencyIsTracking = async (userId, page, itemPerPage) => {
    try {
        console.log(userId, page, itemPerPage);
        const query = {
            userId: userId,
            status: {
                [Sequelize.Op.or]: [REQUEST_STATUS.RESCUING, REQUEST_STATUS.PENDING]
            },
            isEmergency: 1
        }

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

exports.getRequestFromDangerArea = async (requestIds, page, itemPerPage) => {
    try {
        const requests = await Request.findAndCountAll({
            where: {
                id: {
                    [Sequelize.Op.in]: requestIds
                }
            },
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
                        userId: requestIds
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
}

exports.getRequestByRescuerOrPending = async (rescuerId, status, page, itemPerPage) => {
    try {
        let whereCondition = {};

        if (status) {
            whereCondition = {
                [Sequelize.Op.or]: [
                    {
                        rescuerId: rescuerId,
                        status: status
                    },
                ]
            };
        } else {
            whereCondition = {
                [Sequelize.Op.or]: [
                    {
                        status: REQUEST_STATUS.PENDING
                    }
                ]
            };
        }

        const requests = await Request.findAndCountAll({
            where: whereCondition,
            limit: itemPerPage,
            offset: (page - 1) * itemPerPage,
            order: [
                ["isEmergency", "DESC"],
                ["status", "ASC"],
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
                        userId: rescuerId
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
}

exports.isAssignedByRescuer = async (rescuerId, requestId) => {
    try {
        const request = await Request.findOne({
            where: {
                rescuerId: rescuerId,
                id: requestId
            }
        });

        if (request) {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.updateRequest = async (requestId, data) => {
    try {
        const request = await Request.update(
            data,
            {
                where: {
                    id: requestId
                }
            }
        );

        return request;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
