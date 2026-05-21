const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Mengubah parameter menjadi objek agar mendukung destructuring search dan role
exports.getAllUsers = async ({ search = "", role = "" } = {}) => {
  let queryStr =
    "SELECT id, name, email, role, created_at FROM users WHERE 1=1";
  const params = [];

  // Jika ada filter berdasarkan role
  if (role) {
    queryStr += " AND role = ?";
    params.push(role);
  }

  // Jika ada filter pencarian kata kunci nama atau email
  if (search) {
    queryStr += " AND (name LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await db.query(queryStr, params);
  return rows;
};

exports.createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [data.name, data.email, hashedPassword, data.role],
  );
  return { id: result.insertId, ...data };
};

exports.updateUser = async (id, data) => {
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await db.query(
      "UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?",
      [data.name, data.email, hashedPassword, data.role, id],
    );
  } else {
    await db.query("UPDATE users SET name=?, email=?, role=? WHERE id=?", [
      data.name,
      data.email,
      data.role,
      id,
    ]);
  }
  return { id, ...data };
};

exports.deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id=?", [id]);
  return { id };
};
