const db = require("../models/index");
const User = db.users;

exports.profile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findOne({
            where: {
                id,
            },
            include: [
                "requests"
            ],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
