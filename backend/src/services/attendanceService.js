const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT attendances.*, s.name as student_name, sub.name as subject_name 
    FROM attendances
    JOIN users s ON attendances.student_id = s.id
    JOIN subjects sub ON attendances.subject_id = sub.id
    ORDER BY attendances.date DESC
  `);
  return rows;
};

exports.getBySiswa = async (siswaId) => {
  const [rows] = await db.query(`
    SELECT attendances.*, sub.name as subject_name 
    FROM attendances
    JOIN subjects sub ON attendances.subject_id = sub.id
    WHERE student_id = ? ORDER BY date DESC
  `, [siswaId]);
  return rows;
};

exports.create = async (data) => {
  const [res] = await db.query(
    'INSERT INTO attendances (student_id, subject_id, date, status, notes) VALUES (?, ?, ?, ?, ?)',
    [data.student_id, data.subject_id, data.date, data.status, data.notes]
  );
  return { id: res.insertId, ...data };
};

exports.update = async (id, data) => {
  await db.query('UPDATE attendances SET status=?, notes=? WHERE id=?', [data.status, data.notes, id]);
  return { id, ...data };
};

exports.delete = async (id) => {
  await db.query('DELETE FROM attendances WHERE id=?', [id]);
  return true;
};
