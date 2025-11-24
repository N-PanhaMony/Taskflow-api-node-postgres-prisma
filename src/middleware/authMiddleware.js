import jwt from 'jsonwebtoken'

// Authentication middleware to protect routes
function authMiddleware(req, res, next) {
    // Get token from Authorization header
    const token = req.headers['authorization']

    // If no token -> unauthorized
    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // If token invalid or expired
        if (err) {
            return res.status(401).json({ message: "Invalid token" })
        }

        // Save decoded user ID for next middlewares/routes
        req.userId = decoded.id

        // Continue to next handler
        next()
    })
}

export default authMiddleware
