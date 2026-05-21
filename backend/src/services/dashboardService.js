const db = require('../config/db');

exports.getStats = async (user) => {
  let stats = {};
  const [uCount] = await db.query('SELECT COUNT(*) as total FROM users');
  const [sCount] = await db.query('SELECT COUNT(*) as total FROM subjects');
  const [aCount] = await db.query('SELECT COUNT(*) as total FROM attendances');

  stats.totalUsers = uCount[0].total;
  stats.totalSubjects = sCount[0].total;
  stats.totalAttendances = aCount[0].total;

  // Struktur Chart (Data kehadiran)
  const [chartData] = await db.query(`
    SELECT status, COUNT(*) as count 
    FROM attendances 
    ${user.role === 'siswa' ? 'WHERE student_id = ' + user.id : ''} 
    GROUP BY status
  `);
  stats.chart = chartData;
  return stats;
};
