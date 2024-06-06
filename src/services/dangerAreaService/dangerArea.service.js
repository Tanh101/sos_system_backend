const DangerArea = require("../../app/models/mongo/dangerArea");

exports.create = async (requestId, latitude, longitude, radius, message) => {
    try {
        const dangerArea = await DangerArea.create({
            requestId,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            radius,
            message,
            status: "active",
        });

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
