import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized - No token provided",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Not authorized - Invalid token",
        success: false,
      });
    }

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
        success: false,
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Not authorized - Invalid token", success: false });
    } else {
      return res.status(500).json({ message: "Server error", success: false });
    }
  }
};
