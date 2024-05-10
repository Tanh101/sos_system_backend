const db = require("../../app/models/index");
const RequestType = db.requestTypes;


exports.get = async (page, itemPerPage, status, isEmergency) => {
    try {
        const requestType = await RequestType.findAll();

        return requestType;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
