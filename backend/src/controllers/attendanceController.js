const attendanceService = require('../services/attendanceService');

exports.getAttendances = async (req, res) => {
  const data = await attendanceService.getAll();
  res.json({ success: true, data });
};

exports.getSiswaAttendance = async (req, res) => {
  const data = await attendanceService.getBySiswa(req.user.id);
  res.json({ success: true, data });
};

exports.createAttendance = async (req, res) => {
  try {
    const payload = req.user.role === 'siswa' ? { ...req.body, student_id: req.user.id } : req.body;
    const data = await attendanceService.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Anda sudah mengisi absen mata pelajaran ini hari ini!' });
  }
};

exports.updateAttendance = async (req, res) => {
  const data = await attendanceService.update(req.params.id, req.body);
  res.json({ success: true, data });
};

exports.deleteAttendance = async (req, res) => {
  await attendanceService.delete(req.params.id);
  res.json({ success: true, message: 'Absensi dihapus' });
};