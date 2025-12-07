import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) return null;
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return false;
  const { name, email: Email, phone, role } = user;
  const token = Jwt.sign({ name, Email, phone, role }, config.jwtSecret!, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const authServices = {
  loginUser,
};