import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import User from "../models/user.model";
import TokenModel from "../models/token.model";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import { TokenPayload } from "../types/tokenPayload";

// Register
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);

  const newUser = new User({ username, email, password: hashedPassword });
  const savedUser = await newUser.save();

  const payload: TokenPayload = { id: savedUser._id.toString() };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Lưu refreshToken vào DB để quản lý
  await TokenModel.create({ userId: savedUser._id, token: refreshToken });

  return { savedUser, accessToken, refreshToken };
};

// Login
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid login information");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid login information");

  const payload: TokenPayload = { id: user._id.toString() };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Lưu refresh token vào DB
  await TokenModel.create({ userId: user._id, token: refreshToken });

  return { user, accessToken, refreshToken };
};

// getUserProfile
export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

// Create new AccessToken
export const generateNewAccessToken = async (payload: TokenPayload) => {
  return generateAccessToken(payload);
};

// Logout
export const logoutUser = async (refreshToken: string) => {
  await TokenModel.deleteOne({ token: refreshToken });
};
