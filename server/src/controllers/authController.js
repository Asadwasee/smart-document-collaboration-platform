import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/mail.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { generateOpaqueToken, hashToken } from "../utils/token.js";
import {
  badRequest,
  conflict,
  isNonEmptyString,
  isValidEmail,
  normalizeEmail,
  notFound,
  unauthorized,
} from "../utils/validation.js";

const REFRESH_COOKIE = "refreshToken";

const isProd = process.env.NODE_ENV === "production";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth",
};

const parseExpiryMs = (value, fallbackMs) => {
  if (!value) {
    return fallbackMs;
  }

  const parsed = value.match(/^(\d+)([smhd])$/i);
  if (!parsed) {
    return fallbackMs;
  }

  const amount = Number(parsed[1]);
  const unit = parsed[2].toLowerCase();
  const map = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return amount * map[unit];
};

const refreshExpiryMs = parseExpiryMs(process.env.JWT_REFRESH_EXPIRES_IN || "7d", 7 * 86400000);
const accessExpiry = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const parseRefreshToken = (req) => {
  const tokenFromCookie = req.cookies?.[REFRESH_COOKIE];
  const tokenFromBody = req.body?.refreshToken;

  if (isNonEmptyString(tokenFromCookie)) {
    return tokenFromCookie.trim();
  }

  if (isNonEmptyString(tokenFromBody)) {
    return tokenFromBody.trim();
  }

  return null;
};

const issueSession = async (res, user, req) => {
  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  const decoded = jwt.decode(refreshToken);

  const tokenHash = hashToken(refreshToken);
  user.sessions.push({
    tokenHash,
    expiresAt: new Date((decoded?.exp || 0) * 1000 || Date.now() + refreshExpiryMs),
    userAgent: req.get("user-agent") || "",
    ip: req.ip || "",
  });
  await user.save();

  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...refreshCookieOptions,
    maxAge: refreshExpiryMs,
  });

  return {
    accessToken,
    accessTokenExpiresIn: accessExpiry,
  };
};

const sendVerificationEmail = async (user, req) => {
  const rawToken = generateOpaqueToken();
  user.emailVerificationTokenHash = hashToken(rawToken);
  user.emailVerificationTokenExpiresAt = new Date(Date.now() + 24 * 3600000);
  await user.save();

  const verifyLink = `${clientUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your Smart Docs account",
    text: `Verify your email by visiting: ${verifyLink}`,
    html: `<p>Verify your account by clicking <a href="${verifyLink}">this link</a>.</p>`,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      throw badRequest("Name, email, and password are required.");
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      throw badRequest("Invalid email.");
    }

    if (password.trim().length < 8) {
      throw badRequest("Password must be at least 8 characters.");
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw conflict("Email already in use.");
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(),
    });

    await sendVerificationEmail(user, req);

    return res.status(201).json({
      message: "Account created. Please verify your email.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      throw badRequest("Email and password are required.");
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      throw badRequest("Invalid email.");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw unauthorized("Invalid credentials.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw unauthorized("Invalid credentials.");
    }

    if (!user.isEmailVerified) {
      throw badRequest("Please verify your email first.");
    }

    const session = await issueSession(res, user, req);
    return res.json({
      message: "Login successful.",
      user: sanitizeUser(user),
      ...session,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!isNonEmptyString(token)) {
      throw badRequest("Verification token is required.");
    }

    const tokenHash = hashToken(token.trim());
    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw badRequest("Invalid or expired verification token.");
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationTokenExpiresAt = null;
    await user.save();

    return res.json({ message: "Email verified successfully." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!isNonEmptyString(email)) {
      throw badRequest("Email is required.");
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      throw badRequest("Invalid email.");
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ message: "If the email exists, a verification link has been sent." });
    }

    if (user.isEmailVerified) {
      throw badRequest("Email is already verified.");
    }

    await sendVerificationEmail(user, req);
    return res.json({ message: "Verification email sent." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!isNonEmptyString(email)) {
      throw badRequest("Email is required.");
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      throw badRequest("Invalid email.");
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ message: "If the email exists, password reset instructions were sent." });
    }

    const rawToken = generateOpaqueToken();
    user.passwordResetTokenHash = hashToken(rawToken);
    user.passwordResetTokenExpiresAt = new Date(Date.now() + 30 * 60000);
    await user.save();

    const resetLink = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your Smart Docs password",
      text: `Reset your password by visiting: ${resetLink}`,
      html: `<p>Reset your password by clicking <a href="${resetLink}">this link</a>.</p>`,
    });

    return res.json({ message: "If the email exists, password reset instructions were sent." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!isNonEmptyString(token) || !isNonEmptyString(newPassword)) {
      throw badRequest("Token and newPassword are required.");
    }

    if (newPassword.trim().length < 8) {
      throw badRequest("Password must be at least 8 characters.");
    }

    const tokenHash = hashToken(token.trim());
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw badRequest("Invalid or expired reset token.");
    }

    user.password = newPassword.trim();
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpiresAt = null;
    user.sessions = [];
    await user.save();

    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
    return res.json({ message: "Password reset successful. Please log in again." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const refreshSession = async (req, res) => {
  try {
    const refreshToken = parseRefreshToken(req);

    if (!refreshToken) {
      throw unauthorized("Refresh token missing.");
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorized("Invalid refresh token.");
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw unauthorized("Invalid refresh token.");
    }

    const incomingHash = hashToken(refreshToken);
    const sessionExists = user.sessions.some((session) => session.tokenHash === incomingHash);

    if (!sessionExists) {
      throw unauthorized("Session not found.");
    }

    user.sessions = user.sessions.filter((session) => session.tokenHash !== incomingHash);

    const nextSession = await issueSession(res, user, req);
    return res.json({
      message: "Session refreshed.",
      ...nextSession,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = parseRefreshToken(req);

    if (!refreshToken) {
      res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
      return res.json({ message: "Logged out." });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.sub);

      if (user) {
        const incomingHash = hashToken(refreshToken);
        user.sessions = user.sessions.filter((session) => session.tokenHash !== incomingHash);
        await user.save();
      }
    } catch {
      // Clear cookie even if token is invalid/expired.
    }

    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
    return res.json({ message: "Logged out." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const logoutAllSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw notFound("User not found.");
    }

    user.sessions = [];
    await user.save();

    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
    return res.json({ message: "All sessions logged out." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: req.user });
};
