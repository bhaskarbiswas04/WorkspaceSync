import bcrypt from "bcryptjs";

import User from "../user/user.model.js";
import Session from "../session/session.model.js";

import AppError from "../../utils/AppError.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/token.js";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

// Create a new session and issue tokens.
const createSession = async (user, metadata = {}) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await Session.create({
    user: user._id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    userAgent: metadata.userAgent || "",
    ipAddress: metadata.ipAddress || "",
  });

  return {
    accessToken,
    refreshToken,
  };
};

// Register user.
export const registerUser = async ({ name, email, password }, metadata) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const tokens = await createSession(user, metadata);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    ...tokens,
  };
};

// Login user.
export const loginUser = async ({ email, password }, metadata) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();

  await user.save();

  const tokens = await createSession(user, metadata);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    ...tokens,
  };
};

// Refresh access token and rotate refresh token.
export const refreshUserSession = async (oldToken) => {
  const oldHash = hashRefreshToken(oldToken);

  const session = await Session.findOne({
    tokenHash: oldHash,
  }).select("+tokenHash");

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (session.revokedAt || session.expiresAt <= new Date()) {
    throw new AppError("Session expired or revoked", 401);
  }

  const user = await User.findById(session.user);

  if (!user || !user.isActive) {
    throw new AppError("User account unavailable", 401);
  }

  const newRefreshToken = generateRefreshToken();

  // Atomic rotation: only one request can rotate this token.
  const updatedSession = await Session.findOneAndUpdate(
    {
      _id: session._id,
      tokenHash: oldHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        tokenHash: hashRefreshToken(newRefreshToken),
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + SESSION_DURATION),
      },
    },
    {
      new: true,
    },
  );

  if (!updatedSession) {
    throw new AppError("Refresh token already used", 401);
  }

  return {
    accessToken: generateAccessToken(user._id),
    refreshToken: newRefreshToken,
  };
};

// Logout and revoke current session.
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  await Session.findOneAndUpdate(
    {
      tokenHash: hashRefreshToken(refreshToken),
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};