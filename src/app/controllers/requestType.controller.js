const db = require("../models/index");
const RequestType = db.requestTypes;
const requestTypeService = require("../../services/requestTypeService/requestType.service");

exports.get = async (req, res) => {
    try {
        const requestType = await requestTypeService.get();
        return res.status(200).json(requestType);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
