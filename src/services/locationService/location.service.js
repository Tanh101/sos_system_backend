const Location = require("../../app/models/mongo/location");

exports.update = async (requestId, latitude, longitude) => {
    try {
        const location = await Location.findOneAndUpdate(
            { requestId },
            {
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                updatedAt: new Date(),
                // Add createdAt if the document doesn't exist
                $setOnInsert: { createdAt: new Date() },
            },
            { new: true, upsert: true }
        );

        // console.log("Location updated/created:", location);
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

exports.find = async (requestId) => {
    try {
        const locations = await Location.find({ requestId })
            .sort({ updatedAt: -1 })
            .limit(1);
        return locations[0];
    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
    }
};
