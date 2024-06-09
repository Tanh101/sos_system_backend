const db = require("../../app/models/index");
const RequestMedia = db.requestMedia;

exports.create = async (requestId, urls) => {
    try {
        urls.map(async (url) => {
            await RequestMedia.create({
                requestId: requestId,
                url: url,
            });
        });

        return true;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateMedia = async (requestId, urls) => {
    try {
        await RequestMedia.destroy({
            where: {
                requestId: requestId,
            },
        });

        urls.map(async (url) => {
            await RequestMedia.create({
                requestId: requestId,
                url: url,
            });
        });

        return true;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
