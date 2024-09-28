const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userMiddlewares = async (req, res, next) => {
    // Get the admin token from headers or cookies
    const userToken = req.headers.userToken || req.cookies.userToken;

    try {
        // Check if userToken exists, return an error if missing
        if (!userToken) {
            return res.status(401).json({
                message: "User token not found"
            });
        }

        // Verify the user token using the secret
        const decodeUserToken = jwt.verify(userToken, process.env.JWT_SECRET_USER);

        // Attach the decoded user ID (or other data) to the request object
        req.user = decodeUserToken.id;

        // Move to the next middleware or controller
        next();

    } catch (error) {
        // If token verification fails, return an error
        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports = {
    userMiddlewares
};
