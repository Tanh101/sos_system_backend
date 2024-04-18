const AWS = require('aws-sdk');


exports.upload = async (req, res) => {
    try {
        if (!req?.files) {
            return res.status(403).json({
                success: false,
                message: "please upload a file"
            })
        }
        
        const s3StoreArray = req.files.map((file) => {
            return {
                url: file.location,
                type: file.mimetype
            }
        });

        return res.status(200).json({
            data: s3StoreArray,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}
