import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
