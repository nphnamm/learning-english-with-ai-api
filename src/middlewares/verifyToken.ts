import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/token.util";
import { TokenPayload } from "../types/tokenPayload";

//  Mở rộng interface Request để thêm thuộc tính user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

//  Middleware dùng để xác thực token AccessToken trước khi vào các route cần bảo vệ
export const verifyAccessTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyRefreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
    return;
  }

  req.user = payload;
  next();
};
