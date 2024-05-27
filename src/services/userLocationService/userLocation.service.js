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

exports.update = async (userId, latitude, longitude) => {

}


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
