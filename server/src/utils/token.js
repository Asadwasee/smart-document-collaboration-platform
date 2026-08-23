import crypto from "crypto";

export const generateOpaqueToken = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
