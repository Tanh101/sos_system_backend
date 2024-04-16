const jwtConfig = require("../app/configs/jwt.config");
const { verifyToken } = require("../app/controllers/auth.controller");
const { User } = require("../services/db");

const authMiddleware = {
    getAccessToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.accessToken = token;
        next();
    },
    checkAuth: async (req, res, next) => {
        const accessToken = req.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accessTokenSecret = jwtConfig.accessTokenSecret;

        const verified = await verifyToken(
            accessToken,
            accessTokenSecret
        );
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.scope('withPassword').findByPk(verified.payload.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const refreshToken = user.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;

        next();
    }
}

module.exports = authMiddleware;
