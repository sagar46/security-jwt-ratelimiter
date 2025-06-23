require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header required" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Bearer token required in Authorization header" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing after Bearer" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = verifyToken;
