const db = require("../models/index");
const Request = db.requests;
const requestService = require("../../services/requestService/request.service");
const requestMediaService = require("../../services/requestMediaService/requestMedia.service");
const userLocationService = require("../../services/userLocationService/userLocation.service");
const { stringify } = require('flatted');
const {
    PAGE,
    REQUEST_STATUS,
    ITEM_PER_PAGE,
} = require("../../constants/constants");
const user = require("../models/user");

exports.create = async (req, res) => {
    try {
        const { id } = req.user;
        const { requestTypeId, media, isEmergency } = req.body;

        const isExistRequestType = await requestService.isExistRequestType(
            requestTypeId
        );
        if (!isExistRequestType) {
            return res.status(404).json({ message: "Request type not found" });
        }

        const request = await requestService.create(id, req.body);

        if (!isEmergency && media && media.length > 0) {
            await requestMediaService.create(request.id, media);
        }

        return res.status(200).json(request);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.get = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerPage) || ITEM_PER_PAGE;
        const status = req.query.status || REQUEST_STATUS[0];
        const isEmergency = req.query.isEmergency;
        const userId = req.user.id;

        const requests = await requestService.get(
            page,
            itemPerPage,
            status,
            isEmergency,
            userId
        );

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

                    return {
                        ...request.dataValues,
                        distance: distance,
                    };
                })
            ),
            paginations,
        };

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
        }
        return res.status(200).json({
            ...request.dataValues,
            distance: distance ? parseFloat(distance.toFixed(2)) : null,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
