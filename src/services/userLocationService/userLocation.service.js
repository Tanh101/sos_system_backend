const UserLocation = require("../../app/models/mongo/userLocation.model");

exports.getUsersInArea = async (latitude, longitude, radius) => {
    try {
        const users = await UserLocation.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radius / 6378.1],
                },
            },
        });

        return users;
    } catch (error) {
        console.error("Error fetching users in area:", error);
        throw error;
    }
};

exports.update = async (userId, latitude, longitude) => {
    
}
