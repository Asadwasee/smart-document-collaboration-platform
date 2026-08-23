import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const ensureSecrets = () => {
  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured.");
  }
};

export const signAccessToken = (payload) => {
  ensureSecrets();
  return jwt.sign(payload, accessSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" });
};

export const signRefreshToken = (payload) => {
  ensureSecrets();
  return jwt.sign(payload, refreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" });
};

export const verifyAccessToken = (token) => {
  ensureSecrets();
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token) => {
  ensureSecrets();
  return jwt.verify(token, refreshSecret);
};
