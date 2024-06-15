const db = require("../../app/models/index");
const User = db.users;

exports.getUserById = async (id) => {
    try {
        const user = await User.scope("withoutEmail").findOne({
            where: { id },
        });

        return user;
    } catch (error) {
        throw error;
    }
};

exports.updateUser = async (id, data) => {
    try {
        const user = await User.findOne({
            where: { id },
        });

        if (!user) {
            return null;
        }

        await user.update(data);

        return user;
    } catch (error) {
        throw error;
    }
};
