const db = require("../models/index");
const Request = db.requests;
const requestService = require("../../services/requestService/request.service");
const requestMediaService = require("../../services/requestMediaService/requestMedia.service");

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
        const page = req.query.page || PAGE;
        const itemPerPage = req.query.itemPerPage || ITEM_PER_PAGE;
        const status = req.query.status | REQUEST_STATUS[0];
        const isEmergency = req.query.isEmergency;

        const requests = await requestService.get(
            page,
            itemPerPage,
            status,
            isEmergency
        );

        const totalPage = Math.ceil(requests.count / itemPerPage);

        const paginations = {
            totalResult: requests.rows.length,
            totalPage,
            currentPage: page,
            itemPerPage,
        };

        const requestData = {
            requests: requests.rows,
            paginations,
        };

        return res.status(200).json(requestData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getDetail = async (id, userId) => {
    try {
        const request = await requestService.getDetail(id, userId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        return res.status(200).json(request);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.isExistRequest = async (id) => {
    const request = await Request.findOne({
        where: {
            id: id
        }
    });

    if (!request) {
        return false;
    }

    return true;
}

exports.upvotePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const voteCount = await requestService.upvote(id, userId);

        return res.status(200).json(voteCount);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.downvotePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const voteCount = await requestService.downvote(id, userId);

        return res.status(200).json(voteCount);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
