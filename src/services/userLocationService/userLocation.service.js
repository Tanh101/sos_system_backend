const haversine = require("haversine-distance");

const UserLocation = require("../../app/models/mongo/userLocation");
const { USER_ROLE, MAX_DISTANCE } = require("../../constants/constants");

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

exports.createOrUpdate = async (userId, role, latitude, longitude) => {
    try {
        const userLocation = await UserLocation.findOneAndUpdate(
            { userId: userId },
            {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    role: role
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

exports.getAllRescuerLocation = async () => {
    try {
        const rescuerLocation = await UserLocation.find({
            role: USER_ROLE.RESCUER,
        });

        return rescuerLocation;
    } catch (error) {
        console.log(error);
        throw error;;
    }
}

exports.getRescuerNearby = async (location) => {
    try {
        if (!location || typeof location.longitude !== 'number' || typeof location.latitude !== 'number') {
            throw new Error('Invalid location coordinates');
        }

        const rescuers = await UserLocation.find({
            role: USER_ROLE.RESCUER,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude],
                    },
                    $maxDistance: MAX_DISTANCE,
                },
            },
        });

        return rescuers;
    } catch (error) {
        console.error('Error finding nearby rescuers:', error);
        throw error;
    }
};
