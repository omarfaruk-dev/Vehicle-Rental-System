import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hashedPass = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );
  return result;
};

const getAllUser = async () => {

  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
    [name, email, phone, role, id]
  );
  return result;
};

const deleteUser = async (id: string) => {
  // Check for active bookings
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
};
