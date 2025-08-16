import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator";
import validateRequest from "../middlewares/validateRequest";
import {
  login,
  logout,
  profile,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import {
  verifyAccessTokenMiddleware,
  verifyRefreshTokenMiddleware,
} from "../middlewares/verifyToken";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);

router.post("/login", loginValidator, validateRequest, login);

router.get("/profile", verifyAccessTokenMiddleware, profile);

router.post("/refresh-token", verifyRefreshTokenMiddleware, refreshToken);

router.post("/logout", logout);

export default router;
