const { DEFAULT_CONTENT_TYPE } = require("multer-s3");
const db = require("../models/index");
const { ITEM_PER_PAGE, PAGE } = require("../../constants/constants");
const { Op } = require("sequelize");
const User = db.users;
const userLocationService = require("../../services/userLocationService/userLocation.service");
const userService = require("../../services/userService/user.service");

exports.profile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findOne({
            where: { id },
            // include: ["requests"],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id === id) {
            return res
                .status(403)
                .json({ message: "You can't change your status" });
        }

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.status = user.status === 1 ? 0 : 1;
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.filterUser = async (req, res) => {
    try {
        const { name, email, status, address, sortBy, sortOrder } =
        req.body;

        const role = req.query.role || 'user';

        if (role === "admin") {
            return res.status(403).json({ message: "You can't filter admin" });
        }
        const page = parseInt(req.query.page) || PAGE;
        const itemPerPage = parseInt(req.query.itemPerpage) || 5;

        const whereClause = {
            role: { [Op.not]: "admin" },
        };

        if (name) {
            whereClause.name = { [Op.like]: `%${name}%` };
        }
        if (email) {
            whereClause.email = { [Op.like]: `%${email}%` };
        }
        if (status !== undefined && status !== null) {
            whereClause.status = status;
        }
        if (role) {
            whereClause.role = role;
        }
        if (address) {
            whereClause.address = { [Op.like]: `%${address}%` };
        }

        const orderClause = [
            ["createdAt", "DESC"],
        ];
        if (sortBy) {
            const order =
                sortOrder && ["ASC", "DESC"].includes(sortOrder.toUpperCase())
                    ? sortOrder.toUpperCase()
                    : "ASC";
            orderClause.push([sortBy, order]);
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            limit: itemPerPage,
            offset: (page - 1) * itemPerPage,
            order: orderClause,
        });

        const pagination = {
            totalResult: count,
            totalPage: Math.ceil(count / itemPerPage),
            currentPage: page,
            itemPerPage: itemPerPage,
        };

        return res.status(200).json({ users: rows, pagination });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.createOrUpdateUserLocation = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude and Longitude is required",
            });
        }
        const userLocation = await userLocationService.createOrUpdate(
            userId,
            role,
            latitude,
            longitude
        );

        if (userLocation) {
            return res.status(200).json(userLocation);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUpdateUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.user;
        const data = req.body;

        const user = await userService.updateUser(id, data);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const { id } = req.user;
        const { avatar } = req.body;
        const user = await User.findOne({ where: { id } });

        if (!avatar) {
            return res.status(400).json({ message: "Avatar is required" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.avatar = avatar;
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.acceptOrRejectRescuer = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "rescuer") {
            return res.status(403).json({ message: "User is not a rescuer" });
        }

        user.status = status;

        await user.save();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}
