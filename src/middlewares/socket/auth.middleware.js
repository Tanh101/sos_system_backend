const jwtConfig = require("../../app/configs/jwt.config");
const AuthService = require("../../services/authService/auth.service");

const authMiddleware = {
    checkToken: async (socket, accessToken, next) => {
        try {
            if (!accessToken) {
                return next(new Error("Unauthorized: Missing token"));
            }

            const jwtSecret = jwtConfig.accessTokenSecret;
            const decodedAccessToken = await AuthService.decodeToken(
                accessToken,
                jwtSecret
            );
            if (!decodedAccessToken) {
                return next(new Error("Unauthorized: Invalid token"));
            }
            if (decodedAccessToken.exp < Date.now() / 1000) {
                return next(new Error("Unauthorized: Token expired"));
            }

            socket.user = decodedAccessToken.payload;

            next();
        } catch (error) {
            console.error("Error in authentication middleware:", error);
            return next(new Error("Unauthorized"));
        }
    },
    checkAuthHeader: async (socket, next) => {
        try {
            const authHeader = socket.handshake.headers.authorization;
            const accessToken = authHeader && authHeader.split(" ")[1];
            await authMiddleware.checkToken(socket, accessToken, next);
        } catch (error) {
            console.error("Error in authentication middleware:", error);
            return next(new Error("Unauthorized"));
        }
    },
    checkAuth: async (socket, package, next) => {
        try {
            const accessToken = package[1].accessToken;
            await authMiddleware.checkToken(socket, accessToken, next);
        } catch (error) {
            console.error("Error in authentication middleware:", error);
            return next(new Error("Unauthorized"));
        }
    }
};

module.exports = authMiddleware;
