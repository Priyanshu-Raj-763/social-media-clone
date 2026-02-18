import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/api-response.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json(
                new ApiResponse(401, {}, "Unauthorized User")
            )
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        req.userId = decodedToken.userId;
        return next()
    } catch (error) {
        console.log("Error in authMiddleware ❌", error)
        return res.status(401).json(
            new ApiResponse(401, {}, "Invalid token")
        )   
    }
}