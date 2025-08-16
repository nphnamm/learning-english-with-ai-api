import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

/**
 * Register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const { savedUser, accessToken, refreshToken } =
      await AuthService.registerUser(username, email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _password, ...userWithoutPassword } =
      savedUser.toObject();

    res.status(201).json({
      message: "Register successful",
      data: userWithoutPassword,
      tokens: { accessToken },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(400).json({ message: error.message || "Register failed" });
  }
};

/**
 * Login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Missing email or password" });
      return;
    }

    const { user, accessToken, refreshToken } = await AuthService.loginUser(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      data: userWithoutPassword,
      tokens: { accessToken },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(400).json({ message: error.message || "Login failed" });
  }
};

/**
 * Get Profile User
 */
export const profile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await AuthService.getUserProfile(userId);
    res.status(200).json({ message: "Get profile successful", data: user });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(400).json({ message: error.message || "Get profile failed" });
  }
};

/**
 * Refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    const TokenModel = (await import("../models/token.model")).default;
    const savedToken = await TokenModel.findOne({ token: refreshToken });
    if (!savedToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const payload = req.user;
    if (!payload) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    const newAccessToken = await AuthService.generateNewAccessToken(payload);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    res.status(400).json({ message: error.message || "Refresh token failed" });
  }
};

/**
 * Logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    await AuthService.logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(400).json({ message: error.message || "Logout failed" });
  }
};
