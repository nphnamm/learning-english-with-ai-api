import bcrypt from "bcrypt";

// Hàm để mã hoá mật khẩu
export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

// Hàm để so sánh mật khẩu người dùng nhập với mật khẩu đã mã hoá
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
