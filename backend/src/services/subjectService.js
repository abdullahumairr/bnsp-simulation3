const db = require('../config/db');

exports.getSubjects = async () => {
  const [rows] = await db.query(`
    SELECT subjects.*, users.name as teacher_name 
    FROM subjects 
    JOIN users ON subjects.teacher_id = users.id
  `);
  return rows;
};

exports.createSubject = async (data) => {
  const [res] = await db.query('INSERT INTO subjects (name, code, teacher_id) VALUES (?, ?, ?)', [data.name, data.code, data.teacher_id]);
  return { id: res.insertId, ...data };
};

exports.updateSubject = async (id, data) => {
  await db.query('UPDATE subjects SET name=?, code=?, teacher_id=? WHERE id=?', [data.name, data.code, data.teacher_id, id]);
  return { id, ...data };
};

exports.deleteSubject = async (id) => {
  await db.query('DELETE FROM subjects WHERE id=?', [id]);
  return true;
};