const { DANGER_AREA_STATUS } = require('../../constants/constants');
const dangerAreaService = require('../../services/dangerAreaService/dangerArea.service');
const requestService = require('../../services/requestService/request.service');

exports.create = async (req, res) => {
    try {
        const { requestId, radius, message, address } = req.body;
        const request = await requestService.getById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const dangerArea = await dangerAreaService.create(
            requestId,
            request.latitude,
            request.longitude,
            radius,
            message,
            address,
        );


        return res.status(200).json(dangerArea);
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
}

exports.getByStatus = async (req, res) => {
    try {
        const status = req.params.status || DANGER_AREA_STATUS.ACTIVE;

        const dangerArea = await dangerAreaService.getByStatus(status);

        return res.status(200).json(dangerArea);

    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
}

exports.getAllByRescuer = async (req, res) => {
    try {
        const rescuerId = req.user.id;
        const status = req.query.status;

        const dangerArea = await dangerAreaService.getAllDangerArea(rescuerId, status);

        return res.status(200).json(dangerArea);

    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const rescuerId = req.user.id;

        if (status !== DANGER_AREA_STATUS.ACTIVE && status !== DANGER_AREA_STATUS.DELETED) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const existDanger = await dangerAreaService.getByRequestId(requestId);
        if (existDanger.rescuerId !== rescuerId) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const dangerArea = await dangerAreaService.updateStatus(requestId, status);

        return res.status(200).json(dangerArea);
    }
    catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
}

exports.getById = async (req, res) => {
    try {
        const requestId = req.params.id;

        const dangerArea = await dangerAreaService.getByRequestId(requestId);

        if (!dangerArea) {
            return res.status(404).json({ message: "Danger area not found" });
        }

        return res.status(200).json(dangerArea);
    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
}
