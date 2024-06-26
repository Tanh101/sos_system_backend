const { USER_ROLE, KEY_TYPE } = require("../../constants/constants");
const db = require("../models/index");
const User = db.users;
const UserLocation = require("../models/mongo/userLocation");
const Key = require("../models/mongo/keys");

exports.seeder = async (req, res) => {
    try {

        const coordinates = [
            { lat: 16.0658679, lng: 108.219649 },
            { lat: 16.0685261, lng: 108.1815938 },
            { lat: 16.0696458, lng: 108.1528035 },
            { lat: 16.0756527, lng: 108.2242534 },
            { lat: 16.0600789, lng: 108.1798186 },
            { lat: 16.0491902, lng: 108.2385243 }
        ]

        const rescuerInMysql = await User.findAll({
            where: {
                role: USER_ROLE.RESCUER
            }
        });

        if (rescuerInMysql.length > 0) {
            const newUserData = rescuerInMysql.map((user, index) => {
                return {
                    userId: user.id,
                    role: user.role,
                    location: {
                        type: "Point",
                        coordinates: [coordinates[index].lng, coordinates[index].lat],
                    },
                };
            });

            newUserData.map(async (user) => {
                await UserLocation.create(user);
            });
        }

        return res.status(200).json({ message: "Seeder successfully" });
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
}

exports.createOrUpdateKey = async (req, res) => {
    try {
        const { key } = req.body;
        if (!key) return res.status(400).json({ message: "Key is required" });
        
        const type = req.body.type || KEY_TYPE.GGMAP;

        const keyExist = await Key.findOne({ type });

        if (keyExist) {
            keyExist.value = key;
            await keyExist.save();
        } else {
            await Key.create({ value: key, type });
        }

        return res.status(200).json({ message: "Create or update key successfully" });
    } catch (error) {
        console.error("Error creating or updating key:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getKey = async (req, res) => {
    try {
        const type = req.query.type || KEY_TYPE.GGMAP;

        const key
            = await Key.findOne({ type });

        return res.status(200).json({ key: key.value });
    }
    catch (error) {
        console.error("Error getting key:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
