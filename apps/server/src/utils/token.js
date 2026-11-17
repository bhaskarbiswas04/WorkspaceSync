import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      sub: userId.toString(),
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
      issuer: "workspace-api",
      audience: "workspace-client",
    },
  );
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
