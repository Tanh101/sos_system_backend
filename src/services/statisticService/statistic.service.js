const db = require("../../app/models/index");
const { REQUEST_STATUS } = require("../../constants/constants");
const User = db.users;
const Request = db.requests;

exports.getTotalRequestByStatus = async (requestStatus) => {
    try {
        const totalRequest = await Request.count({
            where: {
                status: requestStatus,
            }
        });

        return totalRequest;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.getTotalUserByRole = async (role) => {
    try {
        const totalUser = await User.count({
            where: {
                role: role,
            }
        });

        return totalUser;


    } catch (error) {
        console.log(error);
        throw error;
    }
}
