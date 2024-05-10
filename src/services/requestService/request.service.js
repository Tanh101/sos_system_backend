const db = require("../../app/models/index");
const Request = db.requests;
const RequestType = db.requestTypes;

exports.isExistRequestType = async (id) => {
    const requestType = await RequestType.findOne({
        where: {
            id: id
        }
    });
    if (!requestType) {
        return false;
    }

    return true;
}

const createEmergencyRequest = async (userId, requests) => {
    const newRequest = await Request.create({
        userId: userId,
        requestTypeId: requests.requestTypeId,
        isEmergency: requests.isEmergency,
        content: requests.content,
        latitude: requests.latitude,
        longitude: requests.longitude,
        address: requests.address,
    });

    return newRequest;
}


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
}


exports.get = async (page, itemPerPage, status, isEmergency) => {
    try {
        const requests = await Request.findAndCountAll({
            where: {
                status: status,
                isEmergency: isEmergency
            },
            limit: itemPerPage,
            offset: (page - 1) * itemPerPage,
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                "users",
                "requestTypes",
                "requestMedia"
            ]
        });

        return requests;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}