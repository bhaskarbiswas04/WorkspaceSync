import jwt from "jsonwebtoken";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: "workspace-api",
      audience: "workspace-client",
    });
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }

  req.user = {
    id: decoded.sub,
  };

  next();
});

export default authenticate;