const db = require("../config/db");

exports.getAllSubjects = async () => {
  // Query ini menggabungkan tabel subjects dan users untuk mendapatkan nama guru pengampu
  const [rows] = await db.query(`
    SELECT s.*, u.name AS teacher_name 
    FROM subjects s 
    LEFT JOIN users u ON s.teacher_id = u.id
  `);
  return rows;
};

exports.createSubject = async (data) => {
  const [result] = await db.query(
    "INSERT INTO subjects (code, name, teacher_id) VALUES (?, ?, ?)",
    [data.code, data.name, data.teacher_id],
  );
  return { id: result.insertId, ...data };
};

// UPDATE: Menjalankan query pembaruan mata pelajaran ke MySQL (Baru)
exports.updateSubject = async (id, data) => {
  await db.query(
    "UPDATE subjects SET code = ?, name = ?, teacher_id = ? WHERE id = ?",
    [data.code, data.name, data.teacher_id, id],
  );
  return { id, ...data };
};

exports.deleteSubject = async (id) => {
  await db.query("DELETE FROM subjects WHERE id = ?", [id]);
  return { id };
};
