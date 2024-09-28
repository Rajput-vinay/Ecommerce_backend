const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const adminMiddlewares = async (req, res, next) => {
    // Get the admin token from the headers or cookies
    const adminToken = req.headers.adminToken || req.cookies.adminToken;

    try {
        // Check if adminToken exists, if not, return an error
        if (!adminToken) {
            return res.status(401).json({
                message: "Admin token not found"
            });
        }

        // Verify the admin token using the secret
        const decodedAdminToken = jwt.verify(adminToken, process.env.JWT_SECRET_ADMIN);

        // Attach the admin's ID (or any other required data) to the request object
        req.user = decodedAdminToken.id;

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
    adminMiddlewares
};
