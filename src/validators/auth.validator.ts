import { body } from "express-validator";

// validate cho đăng ký
export const registerValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").notEmpty().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// validate cho đăng nhập
export const loginValidator = [
  body("email").notEmpty().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];
