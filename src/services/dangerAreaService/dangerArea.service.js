const DangerArea = require("../../app/models/mongo/dangerArea");
const { DANGER_AREA_STATUS } = require("../../constants/constants");

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
            status: DANGER_AREA_STATUS.ACTIVE,
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
        if (status) {
            const dangerArea = await DangerArea.find(
                {
                    rescuerId,
                    status
                }
            );
            return dangerArea;
        }

        //sort and return all
        const dangerAreaSort = await DangerArea.find(
            {
                rescuerId
            }
        ).sort({ createdAt: -1 });
        return dangerAreaSort;
    }
    catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
}
