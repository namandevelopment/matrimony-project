import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET_KEY || "sindhi_matrimony_default_jwt_secret";
const getRefreshJwtSecret = () => process.env.REFRESH_JWT_SECRET_KEY || "sindhi_matrimony_default_refresh_secret";

export const signToken = (payload, expiresIn = "2d") => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const generateRefreshToken = (payload, expiresIn = "30d") => {
  return jwt.sign(payload, getRefreshJwtSecret(), { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshJwtSecret());
};
