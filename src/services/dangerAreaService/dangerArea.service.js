const DangerArea = require("../../app/models/mongo/dangerArea");
const { DANGER_AREA_STATUS } = require("../../constants/constants");
const RequestService = require("../requestService/request.service");

exports.create = async (rescuerId, requestId, latitude, longitude, radius, message, address) => {
    try {
        const dangerArea = await DangerArea.create({
            rescuerId,
            requestId,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            radius,
            message,
            status: "active",
            address,
        });

        return dangerArea;
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

exports.createOrUpdate = async (rescuerId, requestId, latitude, longitude, radius, message, address) => {
    try {
        console.log("id", requestId)
        const dangerArea = await DangerArea.findOneAndUpdate(
            {
                requestId,
            },
            {
                rescuerId,
                requestId,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                radius,
                message,
                status: "active",
                address,
                updatedAt: new Date(),
            },
            {
                new: true,
                upsert: true,
            }
        );

        await RequestService.updateRequestDangerStatus(requestId, "active");

        return dangerArea;
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
}

exports.update = async (requestId, radius, message) => {
    try {
        const dangerArea = await DangerArea.findOneAndUpdate(
            {
                requestId,
                status: DANGER_AREA_STATUS.ACTIVE,
            },
            {
                radius,
                message,
            },
            {
                new: true,
            }
        );

        await RequestService.updateRequestDangerStatus(requestId, "active");

        return dangerArea;
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

exports.getByStatus = async (status) => {
    try {
        const dangerArea = await DangerArea.find({ status })
        return dangerArea;

    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
};

exports.updateStatus = async (requestId, status) => {
    try {
        const dangerArea = await DangerArea.findOneAndUpdate({
            requestId
        }, { status }, { new: true });

        await RequestService.updateRequestDangerStatus(requestId, status);

        return dangerArea;
    }
    catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

exports.getByRequestId = async (requestId) => {
    try {
        const dangerArea = await DangerArea.findOne({
            requestId,
        });

        return dangerArea;
    }
    catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
}

exports.getAllDangerArea = async (rescuerId, status) => {
    try {
        let matchStage = { rescuerId };

        if (status) {
            matchStage.status = status;
        }

        const dangerAreas = await DangerArea.aggregate([
            { $match: matchStage },
            {
                $addFields: {
                    sortStatus: {
                        $cond: {
                            if: { $eq: ["$status", "active"] },
                            then: 1,
                            else: { $cond: { if: { $eq: ["$status", "deleted"] }, then: 2, else: 3 } }
                        }
                    }
                }
            },
            { $sort: { sortStatus: 1, createdAt: -1 } },
            { $project: { sortStatus: 0 } } // Exclude the sortStatus field from the final output
        ]);

        return dangerAreas;
    } catch (error) {
        console.error("Error fetching danger areas:", error);
        throw error;
    }
}
