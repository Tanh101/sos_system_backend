const { DANGER_AREA_STATUS } = require('../../constants/constants');
const dangerAreaService = require('../../services/dangerAreaService/dangerArea.service');
const requestService = require('../../services/requestService/request.service');

exports.create = async (req, res) => {
    try {

        const { requestId, radius, message } = req.body;

        const request = await requestService.getById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const dangerArea = await dangerAreaService.create(
            requestId,
            request.latitude,
            request.longitude,
            radius,
            message
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

exports.updateStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        if (status !== DANGER_AREA_STATUS.ACTIVE && status !== DANGER_AREA_STATUS.DELETED) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const dangerArea = await dangerAreaService.updateStatus(requestId, status);

        return res.status(200).json(dangerArea);
    }
    catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
}
