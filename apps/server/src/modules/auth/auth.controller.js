import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from "./auth.service.js";

import asyncHandler from "../../utils/asyncHandler.js";

const COOKIE_NAME = "workspace_refresh";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.COOKIE_SAME_SITE ||
    (process.env.NODE_ENV === "production" ? "none" : "lax"),
  path: "/api/v1/auth",
};

const setRefreshCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
};

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, {
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });

  setRefreshCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, {
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });

  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const oldToken = req.cookies[COOKIE_NAME];

  if (!oldToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  try {
    const result = await refreshUserSession(oldToken);

    setRefreshCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });
  } catch (error) {
    clearRefreshCookie(res);
    throw error;
  }
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[COOKIE_NAME];

  await logoutUser(refreshToken);

  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});