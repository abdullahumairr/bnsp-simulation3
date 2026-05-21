const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (search = '') => {
  const queryStr = 'SELECT id, name, email, role, created_at FROM users WHERE name LIKE ? OR email LIKE ?';
  const [rows] = await db.query(queryStr, [`%${search}%`, `%${search}%`]);
  return rows;
};

exports.createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [data.name, data.email, hashedPassword, data.role]
  );
  return { id: result.insertId, ...data };
};

exports.updateUser = async (id, data) => {
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await db.query('UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?', [data.name, data.email, hashedPassword, data.role, id]);
  } else {
    await db.query('UPDATE users SET name=?, email=?, role=? WHERE id=?', [data.name, data.email, data.role, id]);
  }
  return { id, ...data };
};

exports.deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
  return true;
};
