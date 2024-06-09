const db = require("../models/index");
const requestService = require("../../services/requestService/request.service");
const requestMediaService = require("../../services/requestMediaService/requestMedia.service");
const userLocationService = require("../../services/userLocationService/userLocation.service");
const commentService = require("../../services/commentService/comment.service");
const dangerAreaService = require("../../services/dangerAreaService/dangerArea.service");
const eventEmitter = require("../../utils/eventEmitter");
const NotificationService = require("../../services/notificationService/notification.service");

const {
    PAGE,
    REQUEST_STATUS,
    ITEM_PER_PAGE,
    USER_ROLE,
    DANGER_AREA_STATUS,
} = require("../../constants/constants");

exports.create = async (req, res) => {
    try {
        const { id } = req.user;
        const { requestTypeId, media, isEmergency, content, latitude, longitude, address } = req.body;

        let request;

        if (!isEmergency) {
            const isExistRequestType = await requestService.isExistRequestType(
                requestTypeId
            );
            if (!isExistRequestType) {
                return res.status(404).json({ message: "Request type not found" });
            }

            request = await requestService.createNormalRequest(id, isEmergency, requestTypeId, content, latitude, longitude, address)

        } else {
            request = await requestService.createEmergencyRequest(id, isEmergency, latitude, longitude, address)
        }


        if (!isEmergency && media && media.length > 0) {
            await requestMediaService.create(request.id, media);
        }

        return res.status(200).json(request);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const mappingRequestDataToPagination = async (userId, requests, page, itemPerPage) => {
    const totalPage = Math.ceil(requests.count / itemPerPage);

    const paginations = {
        totalResult: requests.count,
        totalPage,
        currentPage: page,
        itemPerPage,
    };

    const userLocation = await userLocationService.getUserLocation(userId);
    let origin = null;
    if (userLocation) {
        origin = {
            lat: userLocation?.location.coordinates[1],
            lng: userLocation.location.coordinates[0],
        };
    }

    const requestData = {
        requests: await Promise.all(
            requests.rows.map(async (request) => {
                let distance = null;
                const destination = {
                    lat: parseFloat(request.latitude),
                    lng: parseFloat(request.longitude),
                };

                if (userLocation && origin) {
                    distance = await userLocationService.getDistance(origin, destination);
                    distance = parseFloat(distance.toFixed(2));
                }

                const commentCount = await commentService.count(request.id);

                return {
                    ...request.dataValues,
                    distance: distance,
                    commentCount,
                };
            })
        ),
        paginations,
    };

    return requestData;
}
exports.get = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerPage) || ITEM_PER_PAGE;
        const status = req.query.status;
        const isEmergency = req.query.isEmergency;
        const userId = req.user.id;

        const requests = await requestService.get(
            page,
            itemPerPage,
            status,
            isEmergency,
            userId
        );

        const requestData = await mappingRequestDataToPagination(userId, requests, page, itemPerPage);

        return res.status(200).json(requestData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const request = await requestService.getDetail(id, userId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        let distance;


        const userLocation = await userLocationService.getUserLocation(userId);
        if (userLocation) {
            const origin = {
                lat: userLocation.location.coordinates[1],
                lng: userLocation.location.coordinates[0],
            };

            const destination = {
                lat: parseFloat(request.latitude),
                lng: parseFloat(request.longitude),
            };

            distance = await userLocationService.getDistance(origin, destination);
            distance = parseFloat(distance.toFixed(2))
        }
        const commentCount = await commentService.count(id);
        const comments = await commentService.get(id);

        return res.status(200).json({
            ...request.dataValues,
            distance: distance,
            commentCount,
            comments,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getUserRequestByStatus = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerPage) || ITEM_PER_PAGE;
        const status = req.query.status || REQUEST_STATUS.PENDING;
        const isEmergency = req.query.isEmergency;
        const userId = req.user.id;

        const requests = await requestService.getUserRequestByStatus(userId, isEmergency, status, page, itemPerPage);

        const requestData = await mappingRequestDataToPagination(userId, requests, page, itemPerPage);

        return res.status(200).json(requestData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        let status = req.query.status;
        const userId = req.user.id;
        const userName = req.user.name;
        const role = req.user.role;

        const validStatuses = [
            REQUEST_STATUS.PENDING,
            REQUEST_STATUS.RESCUED,
            REQUEST_STATUS.RESCUING,
            REQUEST_STATUS.REJECTED
        ];
        const request = await requestService.getById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        status = parseInt(status);

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        if (request.userId === userId) {
            if (status !== REQUEST_STATUS.RESCUED) {
                return res.status(400).json({ message: "Invalid status" });
            }

            await requestService.finishRequest(id);
        }

        if (role === USER_ROLE.RESCUER) {
            if (status === REQUEST_STATUS.RESCUING && request.status === REQUEST_STATUS.PENDING) {
                await requestService.acceptRequest(userId, id);

                const notiMsg = `Cứu hộ ${userName} đã chấp nhận yêu cầu cứu hộ của bạn`;
                await NotificationService.create(request.userId, notiMsg, id);

                const updatedRequest = await requestService.getById(id);
                eventEmitter.emit("updateRequest", { request: updatedRequest });

            } else if (status === REQUEST_STATUS.PENDING && request.status === REQUEST_STATUS.RESCUING) {
                // Check if the request is being rescued by the rescuer
                const isAssignedByRescuer = await requestService.isAssignedByRescuer(userId, id);
                if (!isAssignedByRescuer) {
                    return res.status(400).json({ message: "You are not assigned to this request" });
                }

                await requestService.reopenRequest(id);

                const notiMsg = `Cứu hộ ${userName} đã hủy tiếp nhận yêu cầu cứu hộ của bạn`;
                await NotificationService.create(request.userId, notiMsg, id);

                const updatedRequest = await requestService.getById(id);
                eventEmitter.emit("updateRequest", { request: updatedRequest });
            }
        } else if (role === USER_ROLE.ADMIN) {
            if (status === REQUEST_STATUS.RESCUED) {
                await requestService.finishRequest(id);
            }

            if (status === REQUEST_STATUS.PENDING) {
                await requestService.reopenRequest(id);
            }
        }

        const newReq = await requestService.getDetail(id, userId);
        if (newReq)
            return res.status(200).json(newReq);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getEmergencyRequestIsTracking = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerPage) || ITEM_PER_PAGE;
        const userId = req.user.id;

        const requests = await requestService.getEmergencyIsTracking(userId, page, itemPerPage);

        const requestData = await mappingRequestDataToPagination(userId, requests, page, itemPerPage);

        return res.status(200).json(requestData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getRequestFromDangerArea = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerPage) || ITEM_PER_PAGE;

        const status = req.query.status || DANGER_AREA_STATUS.ACTIVE;
        const dangerArea = await dangerAreaService.getByStatus(status);

        const requestId = dangerArea.map((area) => area.requestId);


        const requests = await requestService.getRequestFromDangerArea(requestId, page, itemPerPage);

        const totalPage = Math.ceil(requests.count / itemPerPage);

        const paginations = {
            totalResult: requests.count,
            totalPage,
            currentPage: page,
            itemPerPage,
        };

        return res.status(200).json({
            requests: requests.rows,
            paginations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getRequestByRescuer = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerPage) || ITEM_PER_PAGE;
        const status = req.query.status;
        const userId = req.user.id;

        const requests = await requestService.getRequestByRescuerOrPending(userId, status, page, itemPerPage);

        const requestData = await mappingRequestDataToPagination(userId, requests, page, itemPerPage);

        return res.status(200).json(requestData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.user;
        const { requestId } = req.params;
        const { requestTypeId, media, content, latitude, longitude, address } = req.body;

        const request = await requestService.getById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.userId !== id) {
            return res.status(403).json({ message: "You are not allowed to update this request" });
        }

        if (request.isEmergency) {
            return res.status(400).json({ message: "Cannot update emergency request" });
        }

        const isExistRequestType = await requestService.isExistRequestType(requestTypeId);
        if (!isExistRequestType) {
            return res.status(404).json({ message: "Request type not found" });
        }

        const updatedRequest = await requestService.updateRequest(
            requestId,
            {
                requestTypeId,
                content,
                latitude,
                longitude,
                address
            }
        );

        if (media && media.length > 0) {
            await requestMediaService.updateMedia(requestId, media);
        }

        return res.status(200).json(updatedRequest);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
