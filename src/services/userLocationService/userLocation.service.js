const haversine = require("haversine-distance");

const UserLocation = require("../../app/models/mongo/userLocation");

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

exports.createOrUpdate = async (userId, latitude, longitude) => {
    try {
        const userLocation = await UserLocation.findOneAndUpdate(
            { userId: userId },
            {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                },
            },
            {
                new: true,
                upsert: true,
                timestamps: true,
            }
        );

        return userLocation;
    } catch (error) {
        console.error("Error updating user location:", error);
        throw error;
    }
};


exports.getDistance = async (origin, destination) => {
    try {
        const distance = haversine(origin, destination)

        //km
        return distance / 1000;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.getUserLocation = async (userId) => {
    try {
        const userLocation = await UserLocation.findOne({
            userId: userId
        });

        return userLocation;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
